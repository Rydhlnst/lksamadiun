import Link from "next/link";
import {
  getBankAccounts,
  getBusinesses,
  getGallery,
  getLegalities,
  getListItems,
  getProfile,
} from "@/lib/data";
import { entities, type EntityKey } from "@/lib/entities";
import { requireAdmin } from "@/lib/session";
import { storageDriver } from "@/lib/storage";

export default async function DashboardPage() {
  await requireAdmin();
  const [site, items, usaha, galeri, rekening, legalitas] = await Promise.all([
    getProfile(),
    getListItems(),
    getBusinesses(),
    getGallery(),
    getBankAccounts(),
    getLegalities(),
  ]);

  const counts: Record<EntityKey, number> = {
    usaha: usaha.length,
    galeri: galeri.length,
    rekening: rekening.length,
    legalitas: legalitas.length,
    layanan: 0,
    misi: 0,
    tujuan: 0,
    "program-pendek": 0,
    "program-panjang": 0,
    sarana: 0,
  };
  for (const item of items) counts[item.group] += 1;

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Ringkasan</h1>
      <p className="mt-1 text-sm text-slate-600">
        Kelola seluruh isi situs {site.fullName}. Perubahan langsung tampil di halaman
        utama setelah disimpan.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Foto unggahan disimpan di:{" "}
        <strong>{storageDriver() === "r2" ? "Cloudflare R2" : "Database (Neon)"}</strong>
      </p>

      <Link
        href="/admin/profil"
        className="mt-6 block rounded border border-slate-200 bg-white p-5 hover:border-navy"
      >
        <p className="font-semibold text-slate-900">Profil & Kontak</p>
        <p className="mt-1 text-sm text-slate-600">
          {site.address} · {site.phone} · {site.email}
        </p>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(entities) as EntityKey[]).map((key) => (
          <Link
            key={key}
            href={`/admin/data/${key}`}
            className="rounded border border-slate-200 bg-white p-5 hover:border-navy"
          >
            <p className="text-3xl font-bold text-navy">{counts[key]}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{entities[key].title}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
