"use client";

import { useActionState, useState, useTransition } from "react";
import type { Field, FormState } from "@/lib/entities";
import { ImageField } from "./ImageField";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;
type Values = Record<string, string | number | null | undefined>;

const inputClass =
  "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

export function FieldInput({
  field,
  value,
  error,
  idPrefix,
}: {
  field: Field;
  value: string;
  error?: string;
  idPrefix: string;
}) {
  const id = `${idPrefix}-${field.name}`;
  return (
    <div className={field.type === "number" ? "max-w-40" : ""}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {field.label}
        {field.required && <span className="text-rose-600"> *</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea id={id} name={field.name} defaultValue={value} rows={3} className={inputClass} />
      ) : field.type === "select" ? (
        <select id={id} name={field.name} defaultValue={value} className={inputClass}>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "image" ? (
        <ImageField name={field.name} defaultValue={value} required={field.required} />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type === "number" ? "number" : "text"}
          defaultValue={value}
          className={inputClass}
        />
      )}
      {field.hint && !error && <p className="mt-1 text-xs text-slate-500">{field.hint}</p>}
      {error && <p className="mt-1 text-sm text-rose-700">{error}</p>}
    </div>
  );
}

export function StatusMessage({ state }: { state: FormState }) {
  if (!state?.message) return null;
  return (
    <p
      role="status"
      className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-rose-700"}`}
    >
      {state.message}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-navy px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:opacity-60"
    >
      {pending ? "Menyimpan…" : children}
    </button>
  );
}

// Submits through a transition instead of <form action> so that a failed
// validation does not wipe what the admin typed.
export function useForm(action: Action) {
  const [state, dispatch] = useActionState(action, null);
  const [pending, startTransition] = useTransition();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };
  return { state, pending, onSubmit };
}

export function ItemForm({
  action,
  fields,
  item,
  submitLabel,
  children,
}: {
  action: Action;
  fields: Field[];
  item?: Values;
  submitLabel: string;
  children?: React.ReactNode;
}) {
  const { state, pending, onSubmit } = useForm(action);
  // Remount the inputs after a successful "add" so the form comes back empty.
  const isNew = item?.id == null;
  const [version, setVersion] = useState(0);
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state?.ok && isNew) setVersion(version + 1);
  }

  const prefix = isNew ? "new" : `item-${item.id}`;
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {item?.id != null && <input type="hidden" name="id" value={item.id} />}
      <div key={version} className="space-y-4">
        {fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            idPrefix={prefix}
            value={String(item?.[field.name] ?? "")}
            error={state?.errors?.[field.name]}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
        {children}
        <StatusMessage state={state} />
      </div>
    </form>
  );
}

export function DeleteButton({ action, label }: { action: () => Promise<void>; label: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Hapus ${label}? Tindakan ini tidak bisa dibatalkan.`)) {
          startTransition(() => action());
        }
      }}
      className="rounded px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
    >
      {pending ? "Menghapus…" : "Hapus"}
    </button>
  );
}
