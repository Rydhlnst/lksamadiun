import type { Metadata } from "next";
import Image from "next/image";
import { entities, type EntityKey } from "@/lib/entities";
import { requireAdmin } from "@/lib/session";
import { logout } from "../actions";
import { NavLink } from "../components/NavLink";

export const metadata: Metadata = {
  title: "Dashboard | Panti Asuhan Asih",
  robots: { index: false },
};

const groups: { title: string; keys: EntityKey[] }[] = [
  { title: "Konten", keys: ["usaha", "galeri", "rekening", "legalitas"] },
  {
    title: "Daftar",
    keys: ["layanan", "misi", "tujuan", "program-pendek", "program-panjang", "sarana"],
  },
];

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="shrink-0 bg-navy text-white md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <span className="rounded-full bg-white p-1">
            <Image src="/images/logo.jpg" alt="" width={36} height={36} className="size-9 rounded-full" />
          </span>
          <div>
            <p className="text-sm font-bold">Panti Asuhan Asih</p>
            <p className="text-xs text-white/60">Dashboard admin</p>
          </div>
        </div>
        <nav className="space-y-5 p-4">
          <div className="space-y-1">
            <NavLink href="/admin">Ringkasan</NavLink>
            <NavLink href="/admin/profil">Profil & Kontak</NavLink>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-1 px-3 text-xs font-bold uppercase tracking-wider text-white/50">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.keys.map((key) => (
                  <NavLink key={key} href={`/admin/data/${key}`}>
                    {entities[key].title}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-1 border-t border-white/10 pt-4">
            <NavLink href="/admin/akun">Akun ({session.username})</NavLink>
            <a
              href="/"
              target="_blank"
              className="block rounded px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              Lihat situs ↗
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded px-3 py-2 text-left text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                Keluar
              </button>
            </form>
          </div>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
