import { getProfile } from "@/lib/data";
import { profileSections } from "@/lib/entities";
import { requireAdmin } from "@/lib/session";
import { saveProfile } from "../../actions";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  await requireAdmin();
  const site = await getProfile();

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Profil & Kontak</h1>
      <p className="mt-1 text-sm text-slate-600">
        Identitas, kontak, teks tentang kami, akreditasi, dan kampanye donasi.
      </p>
      <ProfileForm action={saveProfile} sections={profileSections} values={site} />
    </>
  );
}
