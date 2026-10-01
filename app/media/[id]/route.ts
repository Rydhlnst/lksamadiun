import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";

export async function GET(_req: Request, ctx: RouteContext<"/media/[id]">) {
  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) return new Response("Not found", { status: 404 });

  const [row] = await db.select().from(media).where(eq(media.id, Number(id)));
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(Buffer.from(row.data, "base64"), {
    headers: {
      "Content-Type": row.mime,
      // Uploads are never overwritten, so each id is safe to cache forever.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
