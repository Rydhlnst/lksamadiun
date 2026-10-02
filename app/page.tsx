import type { Metadata } from "next";
import Image from "next/image";
import { CopyButton } from "./components/CopyButton";
import { Header } from "./components/Header";
import { Icon } from "./components/Icon";
import { getProfile, getSiteData } from "@/lib/data";
import type { AccentName } from "@/lib/entities";
import { navLinks } from "@/lib/nav";
import { iconNames, type IconName } from "./components/Icon";

const accents = {
  emerald: { soft: "bg-emerald-50 text-emerald-700", solid: "bg-emerald-600", bar: "border-t-emerald-500" },
  sky: { soft: "bg-sky-50 text-sky-700", solid: "bg-sky-600", bar: "border-t-sky-500" },
  amber: { soft: "bg-amber-50 text-amber-700", solid: "bg-amber-600", bar: "border-t-amber-500" },
  rose: { soft: "bg-rose-50 text-rose-700", solid: "bg-rose-600", bar: "border-t-rose-500" },
  cyan: { soft: "bg-cyan-50 text-cyan-700", solid: "bg-cyan-600", bar: "border-t-cyan-500" },
  orange: { soft: "bg-orange-50 text-orange-700", solid: "bg-orange-600", bar: "border-t-orange-500" },
  violet: { soft: "bg-violet-50 text-violet-700", solid: "bg-violet-600", bar: "border-t-violet-500" },
  teal: { soft: "bg-teal-50 text-teal-700", solid: "bg-teal-600", bar: "border-t-teal-500" },
} as const;

// Icon and accent come from the database, so fall back if a value is unknown.
const accentOf = (name: string) => accents[name as AccentName] ?? accents.sky;
const iconOf = (name: string): IconName =>
  (iconNames as readonly string[]).includes(name) ? (name as IconName) : "heart";

function SectionHeading({
  badge,
  title,
  subtitle,
  dark = false,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {badge && (
        <span
          className={`mb-4 inline-block rounded px-3 py-1 text-xs font-semibold ${
            dark ? "bg-white/15 text-white" : "bg-navy text-white"
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`text-3xl font-bold sm:text-4xl ${dark ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h2>
      <span className="mx-auto mt-4 block h-1 w-12 rounded bg-gold" />
      {subtitle && (
        <p className={`mt-4 ${dark ? "text-white/75" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function NumberedList({ items, tone }: { items: readonly string[]; tone: string }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed">
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tone}`}
          >
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getProfile();
  return {
    title: `Beranda | ${site.fullName}`,
    description: `${site.fullName} — ${site.address}. ${site.tagline}.`,
  };
}

export default async function Home() {
  const {
    site,
    services,
    missions,
    goals,
    programs,
    facilities,
    businesses,
    gallery,
    bankAccounts,
    legalities,
  } = await getSiteData();

  return (
    <>
      <Header site={site} />

      <main className="flex-1">
        {/* Hero */}
        <section id="beranda" className="relative bg-navy-dark text-white">
          <Image
            src={site.heroImage}
            alt="Anak asuh, pengurus, dan tamu berfoto bersama di Panti Asuhan Asih"
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/75 to-navy-dark/20" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-36">
            <span className="mb-6 inline-flex items-center gap-2 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy">
              <Icon name="award" className="size-4 text-gold-dark" />
              Terakreditasi {site.accRank} · {site.accIssuer}
            </span>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gold sm:text-6xl">
              {site.fullName.replace(/^Yayasan\s+/i, "")}
            </h1>
            <p className="mt-6 text-xl font-medium sm:text-2xl">{site.region}</p>
            <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
              {site.tagline}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#tentang"
                className="inline-flex items-center gap-3 bg-gold px-7 py-4 text-sm font-bold uppercase tracking-wider text-navy-dark transition-colors hover:bg-white"
              >
                Selengkapnya
                <Icon name="arrow" className="size-4" />
              </a>
              <a
                href="#donasi"
                className="inline-flex items-center gap-3 border border-white/60 px-7 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-white hover:text-navy"
              >
                <Icon name="heart" className="size-4" />
                Donasi
              </a>
            </div>
          </div>
        </section>

        {/* Sekilas */}
        <section className="bg-amber-50 px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "users" as const,
                title: "Profil Panti",
                accent: "sky" as const,
                text: "LKS yang melayani anak-anak disabilitas di Kabupaten Madiun.",
                href: "#tentang",
                cta: "Lihat Detail",
              },
              {
                icon: "sprout" as const,
                title: "Usaha Panti",
                accent: "emerald" as const,
                text: `${businesses.length} unit usaha yang menumbuhkan kemandirian.`,
                href: "#usaha",
                cta: "Lihat Usaha",
              },
              {
                icon: "award" as const,
                title: `Akreditasi ${site.accRank}`,
                accent: "violet" as const,
                text: `Peringkat ${site.accRankLabel} dari ${site.accIssuer}.`,
                href: "#legalitas",
                cta: "Lihat Sertifikat",
              },
              {
                icon: "heart" as const,
                title: "Mari Donasi",
                accent: "rose" as const,
                text: site.campaignTitle,
                href: "#donasi",
                cta: "Donasi Sekarang",
              },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className={`group flex flex-col border border-t-4 border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg ${accents[card.accent].bar}`}
              >
                <span
                  className={`mb-4 flex size-11 items-center justify-center rounded ${accents[card.accent].soft}`}
                >
                  <Icon name={card.icon} />
                </span>
                <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {card.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                  {card.cta}
                  <Icon
                    name="arrow"
                    className="size-3.5 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Tentang */}
        <section id="tentang" className="px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded bg-navy px-3 py-1 text-xs font-semibold text-white">
                Siapa Kami?
              </span>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                {site.fullName}
              </h2>
              <p className="mt-6 leading-relaxed text-slate-600">
                {site.aboutIntro}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {services.map((s, i) => (
                  <li
                    key={s}
                    className={`rounded px-3 py-1.5 text-sm font-semibold ${
                      [accents.sky.soft, accents.rose.soft, accents.emerald.soft][i % 3]
                    }`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-relaxed text-slate-600">
                {site.aboutOutro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
                >
                  Hubungi Kami
                </a>
                <a
                  href="#donasi"
                  className="border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  Donasi Sekarang
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="relative col-span-3 aspect-video">
                <Image
                  src={site.aboutImage1}
                  alt={`Lingkungan ${site.name}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative col-span-2 aspect-video">
                <Image
                  src={site.aboutImage2}
                  alt={`Fasilitas ${site.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, 66vw"
                  className="object-cover"
                />
              </div>
              <div className="relative">
                <Image
                  src={site.aboutImage3}
                  alt={`Suasana ${site.name}`}
                  fill
                  sizes="(min-width: 1024px) 17vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Visi Misi */}
        <section id="visi-misi" className="bg-navy px-4 py-20 text-white sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeading badge="Landasan Kami" title="Visi, Misi & Tujuan" dark />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="border-t-4 border-gold bg-white p-7 text-slate-700">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gold-dark">
                  Visi
                </h3>
                <p className="mt-4 text-xl font-bold leading-snug text-navy">
                  {site.vision}
                </p>
              </div>
              <div className="border-t-4 border-sky-500 bg-white p-7 text-slate-700">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-sky-700">
                  Misi
                </h3>
                <NumberedList items={missions} tone="bg-sky-100 text-sky-800" />
              </div>
              <div className="border-t-4 border-emerald-500 bg-white p-7 text-slate-700">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-700">
                  Tujuan
                </h3>
                <NumberedList items={goals} tone="bg-emerald-100 text-emerald-800" />
              </div>
            </div>
          </div>
        </section>

        {/* Program & Sarana */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeading badge="Program" title="Program Kerja & Kegiatan" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-t-4 border-slate-200 border-t-orange-500 p-7 text-slate-700">
                <h3 className="mb-5 text-lg font-bold text-slate-900">
                  Jangka Pendek
                </h3>
                <NumberedList items={programs.short} tone="bg-orange-100 text-orange-800" />
              </div>
              <div className="border border-t-4 border-slate-200 border-t-violet-500 p-7 text-slate-700">
                <h3 className="mb-5 text-lg font-bold text-slate-900">
                  Jangka Panjang
                </h3>
                <NumberedList items={programs.long} tone="bg-violet-100 text-violet-800" />
              </div>
            </div>

            <div className="mt-14 bg-slate-50 p-7 sm:p-10">
              <h3 className="text-center text-xl font-bold text-slate-900">
                Sarana dan Prasarana
              </h3>
              <ul className="mt-6 flex flex-wrap justify-center gap-3">
                {facilities.map((f) => (
                  <li
                    key={f}
                    className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    <Icon name="check" className="size-4 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Usaha Panti */}
        <section id="usaha" className="bg-slate-50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              badge="Badan Usaha"
              title="Usaha Panti"
              subtitle={`Jenis usaha yang dikelola ${site.name}`}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {businesses.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col border border-t-4 border-slate-200 bg-white transition-shadow hover:shadow-lg ${accentOf(item.accent).bar}`}
                >
                  <div className="relative aspect-[4/3]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`flex size-full items-center justify-center ${accentOf(item.accent).soft}`}
                      >
                        <Icon name={iconOf(item.icon)} className="size-14" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 p-5">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded ${accentOf(item.accent).soft}`}
                    >
                      <Icon name={iconOf(item.icon)} />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Galeri */}
        <section id="galeri" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title="Galeri Kegiatan"
              subtitle="Dokumentasi kegiatan dan lingkungan panti"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((photo) => (
                <figure key={photo.id} className="group relative aspect-video overflow-hidden">
                  <Image
                    src={photo.image}
                    alt={photo.caption}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-navy-dark/80 px-4 py-2 text-sm text-white">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Legalitas */}
        <section id="legalitas" className="bg-slate-50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <SectionHeading badge="Legalitas" title="Akreditasi & Legalitas" />
            <div className="grid items-start gap-10 md:grid-cols-[2fr_3fr]">
              <a
                href={site.certificateImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-lg"
              >
                <Image
                  src={site.certificateImage}
                  alt={`Sertifikat akreditasi ${site.fullName} dari ${site.accIssuer}`}
                  width={1132}
                  height={1601}
                  sizes="(min-width: 768px) 400px, 100vw"
                  className="h-auto w-full"
                />
              </a>
              <div>
                <div className="flex items-center gap-5 border-l-4 border-emerald-500 bg-white p-6">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-3xl font-bold text-white">
                    {site.accRank}
                  </span>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      Akreditasi {site.accRankLabel} ({site.accRank})
                    </p>
                    <p className="text-sm text-slate-600">{site.accIssuer}</p>
                  </div>
                </div>
                <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200 text-sm">
                  {[
                    { label: "Nomor Sertifikat", value: site.accNumber },
                    { label: "Kategori", value: site.accCategory },
                    { label: "Masa Berlaku", value: site.accValidity },
                    ...legalities,
                  ].map((row, i) => (
                    <div key={i} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
                      <dt className="font-semibold text-slate-500">{row.label}</dt>
                      <dd className="font-medium text-slate-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Kampanye donasi */}
        <section className="bg-gold px-4 py-16 text-navy-dark sm:px-6">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-video">
              <Image
                src={site.campaignImage}
                alt={site.campaignTitle}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="mb-4 inline-block rounded bg-navy-dark px-3 py-1 text-xs font-semibold text-white">
                Open Donasi
              </span>
              <h2 className="text-3xl font-bold sm:text-4xl">
                {site.campaignTitle}
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-navy-dark/90">
                {site.campaignText}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#donasi"
                  className="bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
                >
                  Donasi Sekarang
                </a>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-navy-dark px-7 py-3 text-sm font-semibold transition-colors hover:bg-navy-dark hover:text-white"
                >
                  Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Donasi */}
        <section id="donasi" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <SectionHeading badge="Donasi" title="Informasi Donasi" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-slate-200 p-7">
                <span className="mb-5 flex size-11 items-center justify-center rounded bg-sky-50 text-sky-700">
                  <Icon name="bank" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Transfer Bank
                </h3>
                <ul className="mt-4 divide-y divide-slate-100">
                  {bankAccounts.map((acc) => (
                    <li
                      key={acc.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-slate-500">{acc.bank}</p>
                        <p className="text-lg font-bold tracking-wide text-navy">
                          {acc.number}
                        </p>
                      </div>
                      <CopyButton value={acc.number} />
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  a.n. <strong>{site.fullName}</strong>
                </p>
                <p className="mt-4 rounded bg-slate-50 p-3 text-sm text-slate-600">
                  Setelah transfer, konfirmasi ke{" "}
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-navy underline"
                  >
                    {site.phone}
                  </a>
                </p>
              </div>

              <div className="border border-slate-200 p-7">
                <span className="mb-5 flex size-11 items-center justify-center rounded bg-emerald-50 text-emerald-700">
                  <Icon name="pin" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Datang Langsung
                </h3>
                <p className="mt-4 text-sm text-slate-600">
                  Anda bisa langsung datang ke:
                </p>
                <p className="mt-3 font-semibold text-slate-900">{site.fullName}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {site.address}
                </p>
                <a
                  href={site.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
                >
                  Buka di Google Maps
                  <Icon name="arrow" className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Kontak */}
        <section id="kontak" className="bg-slate-50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeading badge="Kontak" title="Hubungi Kami" />
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-2">
                {[
                  {
                    icon: "pin" as const,
                    accent: "emerald" as const,
                    label: "Alamat",
                    value: site.address,
                    href: site.maps,
                  },
                  {
                    icon: "phone" as const,
                    accent: "sky" as const,
                    label: "Telepon / WhatsApp",
                    value: site.phone,
                    href: site.whatsapp,
                  },
                  {
                    icon: "mail" as const,
                    accent: "amber" as const,
                    label: "Email",
                    value: site.email,
                    href: `mailto:${site.email}`,
                  },
                  {
                    icon: "globe" as const,
                    accent: "cyan" as const,
                    label: "Website",
                    value: site.website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
                    href: site.website,
                  },
                  {
                    icon: "facebook" as const,
                    accent: "violet" as const,
                    label: "Facebook",
                    value: site.name,
                    href: site.facebook,
                  },
                  {
                    icon: "instagram" as const,
                    accent: "rose" as const,
                    label: "Instagram",
                    value: `@${site.instagramHandle}`,
                    href: site.instagram,
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded ${accentOf(item.accent).soft}`}
                    >
                      <Icon name={item.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {item.label}
                      </span>
                      <span className="mt-1 block break-words text-sm font-medium leading-relaxed text-slate-800">
                        {item.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
              <div className="min-h-80 overflow-hidden border border-slate-200 bg-white lg:col-span-3">
                <iframe
                  src={site.mapsEmbed}
                  title={`Peta lokasi ${site.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="size-full min-h-80 border-0"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy-dark text-white/75">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <span className="shrink-0 rounded-full bg-white p-1.5">
                <Image
                  src="/images/logo.jpg"
                  alt=""
                  width={56}
                  height={57}
                  className="size-14 rounded-full object-contain"
                />
              </span>
              <p className="text-lg font-bold uppercase text-gold">{site.fullName}</p>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed">{site.address}</p>
            <p className="mt-2 text-sm">
              Telp. {site.phone} · {site.email}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">
              Tautan
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-gold">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">
              Media Sosial
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-gold"
                >
                  <Icon name="facebook" className="size-4" /> {site.name}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-gold"
                >
                  <Icon name="instagram" className="size-4" /> @
                  {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-sm">
          © {new Date().getFullYear()} {site.fullName}. All rights reserved.
        </div>
      </footer>

      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105"
      >
        <Icon name="whatsapp" className="size-7" />
      </a>
    </>
  );
}
