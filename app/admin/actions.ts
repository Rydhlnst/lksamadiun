"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  admins,
  bankAccounts,
  businesses,
  gallery,
  legalities,
  listGroups,
  listItems,
  profile,
  type ListGroup,
} from "@/lib/db/schema";
import {
  entities,
  profileSections,
  type EntityKey,
  type Field,
  type FormState,
} from "@/lib/entities";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession, requireAdmin } from "@/lib/session";
import { isAllowedImageUrl, removeImage, storeImage } from "@/lib/storage";

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Values = Record<string, string | number | null>;

function parseFields(fields: Field[], formData: FormData) {
  const values: Values = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const raw = String(formData.get(field.name) ?? "").trim();
    if (field.type === "number") {
      const n = raw === "" ? 0 : Number(raw);
      if (!Number.isInteger(n)) errors[field.name] = "Harus berupa angka bulat";
      values[field.name] = n;
      continue;
    }
    if (raw === "") {
      if (field.required) errors[field.name] = `${field.label} wajib diisi`;
      values[field.name] = field.required ? "" : null;
      continue;
    }
    if (field.type === "select" && !field.options?.includes(raw)) {
      errors[field.name] = "Pilihan tidak valid";
    }
    if (field.type === "image" && !isAllowedImageUrl(raw)) {
      errors[field.name] = "Gambar tidak valid";
    }
    values[field.name] = raw;
  }
  return { values, errors };
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

const isListGroup = (key: string): key is ListGroup =>
  (listGroups as readonly string[]).includes(key);

// Removes stored images that a save replaced or cleared.
async function dropReplaced(
  before: Record<string, unknown> | undefined,
  after: Record<string, unknown>,
) {
  if (!before) return;
  for (const [name, old] of Object.entries(before)) {
    if (typeof old === "string" && name in after && after[name] !== old) {
      await removeImage(old);
    }
  }
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) {
    return { message: "Username dan password wajib diisi" };
  }
  const [admin] = await db.select().from(admins).where(eq(admins.username, username));
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { message: "Username atau password salah" };
  }
  await createSession(admin.id, admin.username);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const [admin] = await db.select().from(admins).where(eq(admins.id, session.adminId));
  if (!admin || !verifyPassword(current, admin.passwordHash)) {
    return { errors: { current: "Password saat ini salah" } };
  }
  if (next.length < 8) {
    return { errors: { next: "Password baru minimal 8 karakter" } };
  }
  if (next !== confirm) {
    return { errors: { confirm: "Konfirmasi password tidak sama" } };
  }
  await db
    .update(admins)
    .set({ passwordHash: hashPassword(next) })
    .where(eq(admins.id, admin.id));
  return { ok: true, message: "Password berhasil diganti" };
}

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Tidak ada file" };
  if (!IMAGE_TYPES.includes(file.type)) {
    return { error: "Format harus JPG, PNG, atau WebP" };
  }
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Ukuran gambar maksimal 3 MB" };

  try {
    return { url: await storeImage(file) };
  } catch (err) {
    console.error(err);
    return { error: "Gagal menyimpan gambar. Coba lagi." };
  }
}

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const fields = profileSections.flatMap((s) => s.fields);
  const { values, errors } = parseFields(fields, formData);
  if (Object.keys(errors).length) {
    return { errors, message: "Periksa kembali isian yang ditandai" };
  }
  const [before] = await db.select().from(profile).where(eq(profile.id, 1));
  await db
    .update(profile)
    .set(values as Partial<typeof profile.$inferInsert>)
    .where(eq(profile.id, 1));
  const images = profileSections
    .flatMap((s) => s.fields)
    .filter((f) => f.type === "image")
    .map((f) => f.name);
  await dropReplaced(
    Object.fromEntries(images.map((n) => [n, before?.[n as keyof typeof before]])),
    values,
  );
  refresh();
  return { ok: true, message: "Profil tersimpan" };
}

export async function saveItem(
  key: EntityKey,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const entity = entities[key];
  if (!entity) return { message: "Jenis data tidak dikenal" };

  const { values: v, errors } = parseFields(entity.fields, formData);
  if (Object.keys(errors).length) {
    return { errors, message: "Periksa kembali isian yang ditandai" };
  }
  const idRaw = String(formData.get("id") ?? "");
  const id = idRaw ? Number(idRaw) : null;
  if (id !== null && !Number.isInteger(id)) return { message: "ID tidak valid" };
  const sortOrder = v.sortOrder as number;

  if (isListGroup(key)) {
    const row = { group: key, text: v.text as string, sortOrder };
    if (id) await db.update(listItems).set(row).where(eq(listItems.id, id));
    else await db.insert(listItems).values(row);
  } else if (key === "usaha") {
    const row = {
      title: v.title as string,
      description: v.description as string,
      icon: v.icon as string,
      accent: v.accent as string,
      image: v.image as string | null,
      sortOrder,
    };
    if (id) {
      const [before] = await db.select().from(businesses).where(eq(businesses.id, id));
      await db.update(businesses).set(row).where(eq(businesses.id, id));
      await dropReplaced({ image: before?.image }, row);
    } else await db.insert(businesses).values(row);
  } else if (key === "galeri") {
    const row = { image: v.image as string, caption: v.caption as string, sortOrder };
    if (id) {
      const [before] = await db.select().from(gallery).where(eq(gallery.id, id));
      await db.update(gallery).set(row).where(eq(gallery.id, id));
      await dropReplaced({ image: before?.image }, row);
    } else await db.insert(gallery).values(row);
  } else if (key === "rekening") {
    const row = { bank: v.bank as string, number: v.number as string, sortOrder };
    if (id) await db.update(bankAccounts).set(row).where(eq(bankAccounts.id, id));
    else await db.insert(bankAccounts).values(row);
  } else if (key === "legalitas") {
    const row = { label: v.label as string, value: v.value as string, sortOrder };
    if (id) await db.update(legalities).set(row).where(eq(legalities.id, id));
    else await db.insert(legalities).values(row);
  }

  refresh();
  return { ok: true, message: id ? "Perubahan tersimpan" : "Data ditambahkan" };
}

export async function deleteItem(key: EntityKey, id: number) {
  await requireAdmin();
  if (!Number.isInteger(id)) return;

  if (isListGroup(key)) {
    await db.delete(listItems).where(eq(listItems.id, id));
  } else if (key === "usaha") {
    const [row] = await db.delete(businesses).where(eq(businesses.id, id)).returning();
    await removeImage(row?.image);
  } else if (key === "galeri") {
    const [row] = await db.delete(gallery).where(eq(gallery.id, id)).returning();
    await removeImage(row?.image);
  } else if (key === "rekening") {
    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  } else if (key === "legalitas") {
    await db.delete(legalities).where(eq(legalities.id, id));
  }
  refresh();
}
