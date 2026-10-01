import { requireAdmin } from "@/lib/session";
import { changePassword } from "../../actions";
import { PasswordForm } from "./PasswordForm";

export default async function AccountPage() {
  const session = await requireAdmin();
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Akun</h1>
      <p className="mt-1 text-sm text-slate-600">
        Masuk sebagai <strong>{session.username}</strong>.
      </p>
      <section className="mt-6 max-w-md rounded border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">Ganti password</h2>
        <PasswordForm action={changePassword} />
      </section>
    </>
  );
}
