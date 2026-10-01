import { config } from "dotenv";
import type { PgTable } from "drizzle-orm/pg-core";

config({ path: ".env.local" });

// Seeds each table only when it is empty, so it is safe to run again.
async function main() {
  const { db } = await import("./index");
  const schema = await import("./schema");
  const data = await import("./seed-data");
  const { hashPassword } = await import("../password");

  const isEmpty = async (table: PgTable) =>
    (await db.select().from(table).limit(1)).length === 0;

  if (await isEmpty(schema.profile)) {
    await db.insert(schema.profile).values({
      id: 1,
      ...data.site,
      heroImage: "/images/hero-kebersamaan.jpg",
      aboutIntro:
        "Kami adalah Lembaga Kesejahteraan Sosial (LKS) yang memberikan pelayanan kepada anak-anak disabilitas, yang terdiri dari:",
      aboutOutro:
        "Sebagian anak tinggal di asrama panti dan mengikuti pendidikan di jenjang SDLB, SMPLB, dan SMALB.",
      aboutImage1: "/images/gedung-panti.jpg",
      aboutImage2: "/images/ruang-serbaguna.jpg",
      aboutImage3: "/images/taman-bibit.jpg",
      vision: data.vision,
      accRank: data.accreditation.rank,
      accRankLabel: data.accreditation.rankLabel,
      accIssuer: data.accreditation.issuer,
      accNumber: data.accreditation.number,
      accCategory: data.accreditation.category,
      accValidity: data.accreditation.validity,
      certificateImage: "/images/sertifikat-akreditasi.jpg",
      campaignTitle: "Pembangunan Asrama Anak Disabilitas",
      campaignText:
        "Bersama kita wujudkan tempat yang nyaman, aman, dan layak bagi anak-anak untuk tumbuh dan meraih masa depan yang lebih baik. Donasi Anda sangat berarti.",
      campaignImage: "/images/pembangunan-asrama.jpg",
    });
    console.log("profile: 1 baris");
  }

  if (await isEmpty(schema.listItems)) {
    const groups: [typeof schema.listGroups[number], readonly string[]][] = [
      ["layanan", data.services],
      ["misi", data.missions],
      ["tujuan", data.goals],
      ["program-pendek", data.programs.short],
      ["program-panjang", data.programs.long],
      ["sarana", data.facilities],
    ];
    const rows = groups.flatMap(([group, items]) =>
      items.map((text, i) => ({ group, text, sortOrder: i + 1 })),
    );
    await db.insert(schema.listItems).values(rows);
    console.log(`list_items: ${rows.length} baris`);
  }

  if (await isEmpty(schema.businesses)) {
    await db
      .insert(schema.businesses)
      .values(data.businesses.map((b, i) => ({ ...b, sortOrder: i + 1 })));
    console.log(`businesses: ${data.businesses.length} baris`);
  }

  if (await isEmpty(schema.gallery)) {
    await db.insert(schema.gallery).values(
      data.gallery.map((g, i) => ({ image: g.src, caption: g.alt, sortOrder: i + 1 })),
    );
    console.log(`gallery: ${data.gallery.length} baris`);
  }

  if (await isEmpty(schema.bankAccounts)) {
    await db
      .insert(schema.bankAccounts)
      .values(data.bankAccounts.map((b, i) => ({ ...b, sortOrder: i + 1 })));
    console.log(`bank_accounts: ${data.bankAccounts.length} baris`);
  }

  if (await isEmpty(schema.legalities)) {
    await db
      .insert(schema.legalities)
      .values(data.legalities.map((l, i) => ({ ...l, sortOrder: i + 1 })));
    console.log(`legalities: ${data.legalities.length} baris`);
  }

  if (await isEmpty(schema.admins)) {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    if (!username || !password) {
      throw new Error("ADMIN_USERNAME dan ADMIN_PASSWORD harus diisi di .env.local");
    }
    await db
      .insert(schema.admins)
      .values({ username, passwordHash: hashPassword(password) });
    console.log(`admins: akun "${username}" dibuat`);
  }

  console.log("Seed selesai.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
