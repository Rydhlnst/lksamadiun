import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { media } from "./db/schema";

// Uploaded images go to Cloudflare R2 when it is configured, and otherwise
// into the `media` table in Postgres (served from /media/[id]). Either way the
// rest of the app only ever sees the resulting URL.

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function r2Config() {
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET,
    R2_PUBLIC_URL,
    R2_ENDPOINT,
  } = process.env;
  if (
    !R2_ACCOUNT_ID ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_BUCKET ||
    !R2_PUBLIC_URL
  ) {
    return null;
  }
  return {
    client: new AwsClient({
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
      service: "s3",
      region: "auto",
    }),
    // R2_ENDPOINT overrides the default host, e.g. for an EU-jurisdiction bucket.
    endpoint: `${(R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`).replace(/\/+$/, "")}/${R2_BUCKET}`,
    publicUrl: R2_PUBLIC_URL.replace(/\/+$/, ""),
  };
}

export const storageDriver = () => (r2Config() ? "r2" : "database");

export async function storeImage(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const r2 = r2Config();

  if (r2) {
    const key = `uploads/${randomUUID()}.${EXTENSIONS[file.type] ?? "jpg"}`;
    const res = await r2.client.fetch(`${r2.endpoint}/${key}`, {
      method: "PUT",
      body: bytes,
      headers: {
        "Content-Type": file.type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
    if (!res.ok) throw new Error(`R2 menolak unggahan (${res.status})`);
    return `${r2.publicUrl}/${key}`;
  }

  const [row] = await db
    .insert(media)
    .values({ mime: file.type, data: bytes.toString("base64") })
    .returning({ id: media.id });
  return `/media/${row.id}`;
}

// Deletes an image this module stored. Bundled /images/* files and anything
// unrecognised are left alone.
export async function removeImage(url: string | null | undefined) {
  if (!url) return;

  const id = url.match(/^\/media\/(\d+)$/)?.[1];
  if (id) {
    await db.delete(media).where(eq(media.id, Number(id)));
    return;
  }

  const r2 = r2Config();
  if (r2 && url.startsWith(`${r2.publicUrl}/uploads/`)) {
    const key = url.slice(r2.publicUrl.length + 1);
    await r2.client.fetch(`${r2.endpoint}/${key}`, { method: "DELETE" });
  }
}

export function isAllowedImageUrl(url: string) {
  if (/^\/(images|media)\/[\w.-]+$/.test(url)) return true;
  const base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
  return !!base && url.startsWith(`${base}/`) && /^[\w./-]+$/.test(url.slice(base.length + 1));
}
