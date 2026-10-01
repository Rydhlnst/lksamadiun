"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/entities";
import { StatusMessage, SubmitButton } from "../../components/Form";

const fields = [
  { name: "current", label: "Password saat ini", autoComplete: "current-password" },
  { name: "next", label: "Password baru", autoComplete: "new-password" },
  { name: "confirm", label: "Ulangi password baru", autoComplete: "new-password" },
];

export function PasswordForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="mb-1.5 block text-sm font-semibold text-slate-700">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type="password"
            autoComplete={f.autoComplete}
            required
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
          {state?.errors?.[f.name] && (
            <p className="mt-1 text-sm text-rose-700">{state.errors[f.name]}</p>
          )}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <SubmitButton pending={pending}>Ganti password</SubmitButton>
        <StatusMessage state={state} />
      </div>
    </form>
  );
}
