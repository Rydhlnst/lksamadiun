import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Single-row table (id = 1) holding everything that appears once on the site.
export const profile = pgTable("profile", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  tagline: text("tagline").notNull(),
  address: text("address").notNull(),
  region: text("region").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  website: text("website").notNull(),
  maps: text("maps").notNull(),
  mapsEmbed: text("maps_embed").notNull(),
  facebook: text("facebook").notNull(),
  instagram: text("instagram").notNull(),
  instagramHandle: text("instagram_handle").notNull(),
  heroImage: text("hero_image").notNull(),
  aboutIntro: text("about_intro").notNull(),
  aboutOutro: text("about_outro").notNull(),
  aboutImage1: text("about_image_1").notNull(),
  aboutImage2: text("about_image_2").notNull(),
  aboutImage3: text("about_image_3").notNull(),
  vision: text("vision").notNull(),
  accRank: text("acc_rank").notNull(),
  accRankLabel: text("acc_rank_label").notNull(),
  accIssuer: text("acc_issuer").notNull(),
  accNumber: text("acc_number").notNull(),
  accCategory: text("acc_category").notNull(),
  accValidity: text("acc_validity").notNull(),
  certificateImage: text("certificate_image").notNull(),
  campaignTitle: text("campaign_title").notNull(),
  campaignText: text("campaign_text").notNull(),
  campaignImage: text("campaign_image").notNull(),
});

export const listGroups = [
  "layanan",
  "misi",
  "tujuan",
  "program-pendek",
  "program-panjang",
  "sarana",
] as const;
export type ListGroup = (typeof listGroups)[number];

export const listItems = pgTable("list_items", {
  id: serial("id").primaryKey(),
  group: text("group").$type<ListGroup>().notNull(),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  accent: text("accent").notNull(),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  caption: text("caption").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  bank: text("bank").notNull(),
  number: text("number").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const legalities = pgTable("legalities", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

// Uploaded images, stored base64-encoded and served from /media/[id].
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  mime: text("mime").notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
