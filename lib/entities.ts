// Field definitions for the admin CRUD forms. Plain data so it can be passed
// to client components; the matching database logic lives in app/admin/actions.ts.

export const accentNames = [
  "emerald",
  "sky",
  "amber",
  "rose",
  "cyan",
  "orange",
  "violet",
  "teal",
] as const;
export type AccentName = (typeof accentNames)[number];

export const businessIcons = [
  "sprout",
  "fish",
  "egg",
  "palette",
  "droplet",
  "coffee",
  "gallon",
  "users",
  "heart",
  "award",
] as const;

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "image" | "select";
  required?: boolean;
  options?: readonly string[];
  hint?: string;
};

const sortOrder: Field = {
  name: "sortOrder",
  label: "Urutan",
  type: "number",
  hint: "Angka kecil tampil lebih dulu",
};

const listFields: Field[] = [
  { name: "text", label: "Isi", type: "textarea", required: true },
  sortOrder,
];

export const entities = {
  usaha: {
    title: "Usaha Panti",
    singular: "usaha",
    summary: "title",
    fields: [
      { name: "title", label: "Nama usaha", type: "text", required: true },
      { name: "description", label: "Keterangan", type: "textarea", required: true },
      { name: "icon", label: "Ikon", type: "select", options: businessIcons, required: true },
      { name: "accent", label: "Warna", type: "select", options: accentNames, required: true },
      { name: "image", label: "Foto", type: "image", hint: "Kosongkan untuk memakai ikon" },
      sortOrder,
    ],
  },
  galeri: {
    title: "Galeri",
    singular: "foto",
    summary: "caption",
    fields: [
      { name: "image", label: "Foto", type: "image", required: true },
      { name: "caption", label: "Keterangan foto", type: "text", required: true },
      sortOrder,
    ],
  },
  rekening: {
    title: "Rekening Donasi",
    singular: "rekening",
    summary: "bank",
    fields: [
      { name: "bank", label: "Nama bank", type: "text", required: true },
      { name: "number", label: "Nomor rekening", type: "text", required: true },
      sortOrder,
    ],
  },
  legalitas: {
    title: "Legalitas",
    singular: "dokumen",
    summary: "label",
    fields: [
      { name: "label", label: "Jenis dokumen", type: "text", required: true },
      { name: "value", label: "Nomor / keterangan", type: "textarea", required: true },
      sortOrder,
    ],
  },
  layanan: { title: "Jenis Layanan", singular: "layanan", summary: "text", fields: listFields },
  misi: { title: "Misi", singular: "misi", summary: "text", fields: listFields },
  tujuan: { title: "Tujuan", singular: "tujuan", summary: "text", fields: listFields },
  "program-pendek": {
    title: "Program Jangka Pendek",
    singular: "program",
    summary: "text",
    fields: listFields,
  },
  "program-panjang": {
    title: "Program Jangka Panjang",
    singular: "program",
    summary: "text",
    fields: listFields,
  },
  sarana: { title: "Sarana dan Prasarana", singular: "sarana", summary: "text", fields: listFields },
} satisfies Record<
  string,
  { title: string; singular: string; summary: string; fields: Field[] }
>;

export type EntityKey = keyof typeof entities;

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
} | null;

const t = (name: string, label: string, required = true): Field => ({
  name,
  label,
  type: "text",
  required,
});
const area = (name: string, label: string): Field => ({
  name,
  label,
  type: "textarea",
  required: true,
});
const img = (name: string, label: string): Field => ({
  name,
  label,
  type: "image",
  required: true,
});

export const profileSections: { title: string; fields: Field[] }[] = [
  {
    title: "Identitas",
    fields: [
      t("name", "Nama singkat"),
      t("fullName", "Nama lengkap yayasan"),
      area("tagline", "Tagline"),
      t("region", "Wilayah (teks di hero)"),
      img("heroImage", "Foto hero"),
    ],
  },
  {
    title: "Kontak & Media Sosial",
    fields: [
      area("address", "Alamat"),
      t("phone", "Telepon"),
      t("whatsapp", "Tautan WhatsApp"),
      t("email", "Email"),
      t("website", "Website"),
      t("maps", "Tautan Google Maps"),
      t("mapsEmbed", "Tautan sematan peta"),
      t("facebook", "Tautan Facebook"),
      t("instagram", "Tautan Instagram"),
      t("instagramHandle", "Nama akun Instagram"),
    ],
  },
  {
    title: "Tentang Kami",
    fields: [
      area("aboutIntro", "Paragraf pembuka"),
      area("aboutOutro", "Paragraf penutup"),
      img("aboutImage1", "Foto utama"),
      img("aboutImage2", "Foto kedua"),
      img("aboutImage3", "Foto ketiga"),
      area("vision", "Visi"),
    ],
  },
  {
    title: "Akreditasi",
    fields: [
      t("accRank", "Peringkat"),
      t("accRankLabel", "Keterangan peringkat"),
      t("accIssuer", "Lembaga penerbit"),
      t("accNumber", "Nomor sertifikat"),
      t("accCategory", "Kategori"),
      t("accValidity", "Masa berlaku"),
      img("certificateImage", "Gambar sertifikat"),
    ],
  },
  {
    title: "Kampanye Donasi",
    fields: [
      t("campaignTitle", "Judul"),
      area("campaignText", "Isi ajakan"),
      img("campaignImage", "Foto"),
    ],
  },
];
