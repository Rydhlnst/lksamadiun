import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { login } from "../actions";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Masuk | Dashboard Panti Asuhan Asih",
  robots: { index: false },
};

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
      <div className="w-full max-w-sm border-t-4 border-gold bg-white p-8 shadow-xl">
        <Image
          src="/images/logo.jpg"
          alt="Logo Panti Asuhan Asih"
          width={72}
          height={73}
          className="mx-auto size-18"
        />
        <h1 className="mt-4 text-center text-xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="mb-6 mt-1 text-center text-sm text-slate-500">Panti Asuhan Asih</p>
        <LoginForm action={login} />
      </div>
    </main>
  );
}
