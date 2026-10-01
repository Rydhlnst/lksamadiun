import { notFound } from "next/navigation";
import {
  getBankAccounts,
  getBusinesses,
  getGallery,
  getLegalities,
  getListItems,
} from "@/lib/data";
import { entities, type EntityKey } from "@/lib/entities";
import { requireAdmin } from "@/lib/session";
import { deleteItem, saveItem } from "../../../actions";
import { DeleteButton, ItemForm } from "../../../components/Form";

type Row = { id: number; sortOrder: number } & Record<string, string | number | null>;

async function getRows(key: EntityKey): Promise<Row[]> {
  switch (key) {
    case "usaha":
      return getBusinesses();
    case "galeri":
      return getGallery();
    case "rekening":
      return getBankAccounts();
    case "legalitas":
      return getLegalities();
    default:
      return (await getListItems()).filter((item) => item.group === key);
  }
}

export default async function EntityPage({ params }: PageProps<"/admin/data/[entity]">) {
  await requireAdmin();
  const { entity: key } = await params;
  if (!Object.hasOwn(entities, key)) notFound();
  const entityKey = key as EntityKey;
  const entity = entities[entityKey];
  const rows = await getRows(entityKey);
  const nextOrder = Math.max(0, ...rows.map((r) => r.sortOrder)) + 1;

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">{entity.title}</h1>
      <p className="mt-1 text-sm text-slate-600">{rows.length} data tersimpan.</p>

      <section className="mt-6 rounded border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">Tambah {entity.singular}</h2>
        <ItemForm
          action={saveItem.bind(null, entityKey)}
          fields={entity.fields}
          item={{ sortOrder: nextOrder }}
          submitLabel="Tambah"
        />
      </section>

      <h2 className="mb-3 mt-8 font-semibold text-slate-900">Data saat ini</h2>
      {rows.length === 0 && (
        <p className="rounded border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Belum ada data.
        </p>
      )}
      <div className="space-y-3">
        {rows.map((row) => {
          const summary = String(row[entity.summary] ?? "");
          const image = typeof row.image === "string" ? row.image : null;
          return (
            <details key={row.id} className="group rounded border border-slate-200 bg-white">
              <summary className="flex cursor-pointer items-center gap-4 p-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {row.sortOrder}
                </span>
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                  <img src={image} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                )}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                  {summary}
                </span>
                <span className="text-xs font-semibold text-navy group-open:hidden">Ubah</span>
                <span className="hidden text-xs font-semibold text-slate-500 group-open:inline">
                  Tutup
                </span>
              </summary>
              <div className="border-t border-slate-100 p-5">
                <ItemForm
                  action={saveItem.bind(null, entityKey)}
                  fields={entity.fields}
                  item={row}
                  submitLabel="Simpan"
                >
                  <DeleteButton
                    action={deleteItem.bind(null, entityKey, row.id)}
                    label={`${entity.singular} “${summary.slice(0, 40)}”`}
                  />
                </ItemForm>
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}
