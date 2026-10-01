import { asc } from "drizzle-orm";
import { cache } from "react";
import { db } from "./db";
import {
  bankAccounts,
  businesses,
  gallery,
  legalities,
  listItems,
  profile,
  type ListGroup,
} from "./db/schema";

export const getProfile = cache(async () => {
  const [row] = await db.select().from(profile).limit(1);
  if (!row) throw new Error("Data profil kosong. Jalankan `npm run db:seed`.");
  return row;
});

export const getListItems = cache(() =>
  db.select().from(listItems).orderBy(asc(listItems.sortOrder), asc(listItems.id)),
);
export const getBusinesses = cache(() =>
  db.select().from(businesses).orderBy(asc(businesses.sortOrder), asc(businesses.id)),
);
export const getGallery = cache(() =>
  db.select().from(gallery).orderBy(asc(gallery.sortOrder), asc(gallery.id)),
);
export const getBankAccounts = cache(() =>
  db.select().from(bankAccounts).orderBy(asc(bankAccounts.sortOrder), asc(bankAccounts.id)),
);
export const getLegalities = cache(() =>
  db.select().from(legalities).orderBy(asc(legalities.sortOrder), asc(legalities.id)),
);

// Everything the public page needs, in one round of parallel queries.
export async function getSiteData() {
  const [site, items, businessRows, galleryRows, bankRows, legalRows] =
    await Promise.all([
      getProfile(),
      getListItems(),
      getBusinesses(),
      getGallery(),
      getBankAccounts(),
      getLegalities(),
    ]);
  const list = (group: ListGroup) =>
    items.filter((i) => i.group === group).map((i) => i.text);

  return {
    site,
    services: list("layanan"),
    missions: list("misi"),
    goals: list("tujuan"),
    programs: { short: list("program-pendek"), long: list("program-panjang") },
    facilities: list("sarana"),
    businesses: businessRows,
    gallery: galleryRows,
    bankAccounts: bankRows,
    legalities: legalRows,
  };
}
