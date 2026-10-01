"use client";

import type { Field, FormState } from "@/lib/entities";
import { FieldInput, StatusMessage, SubmitButton, useForm } from "../../components/Form";

export function ProfileForm({
  action,
  sections,
  values,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  sections: { title: string; fields: Field[] }[];
  values: Record<string, string | number>;
}) {
  const { state, pending, onSubmit } = useForm(action);

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-6">
      {sections.map((section) => (
        <fieldset key={section.title} className="rounded border border-slate-200 bg-white p-5">
          <legend className="px-2 font-semibold text-slate-900">{section.title}</legend>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                idPrefix="profile"
                value={String(values[field.name] ?? "")}
                error={state?.errors?.[field.name]}
              />
            ))}
          </div>
        </fieldset>
      ))}
      <div className="sticky bottom-0 flex items-center gap-4 border-t border-slate-200 bg-slate-50 py-4">
        <SubmitButton pending={pending}>Simpan profil</SubmitButton>
        <StatusMessage state={state} />
      </div>
    </form>
  );
}
