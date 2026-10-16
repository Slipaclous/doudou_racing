import type { Metadata } from "next";
import { ProfileForm } from "@/components/members/Forms";
import { getPayloadClient, memberPartnerId, requireMember } from "@/members/session";
import s from "@/components/members/members.module.css";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
  const member = await requireMember();
  const payload = await getPayloadClient();
  const partner = await payload.findByID({ collection: "partners", id: memberPartnerId(member), depth: 0 });
  return (
    <main className={`${s.main} ${s.narrow}`}>
      <h1 className={s.title}>Mon profil</h1>
      <p className={s.lead}>Ce que les autres partenaires voient de vous et de {partner.name} dans l&apos;annuaire.</p>
      <ProfileForm
        name={member.name}
        jobTitle={member.jobTitle ?? ""}
        company={partner.name}
        offer={partner.offer ?? ""}
        lookingFor={partner.lookingFor ?? ""}
      />
    </main>
  );
}
