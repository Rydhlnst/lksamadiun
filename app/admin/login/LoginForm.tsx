"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/entities";

const inputClass =
  "w-full rounded border border-slate-300 px-3 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

export function LoginForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Username
        </label>
        <input id="username" name="username" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      {state?.message && (
        <p role="alert" className="text-sm font-medium text-rose-700">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-navy py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy-dark disabled:opacity-60"
      >
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
