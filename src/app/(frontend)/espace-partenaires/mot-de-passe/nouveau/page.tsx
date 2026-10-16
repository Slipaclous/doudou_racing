import type { Metadata } from "next";
import Link from "next/link";
import { SetPasswordForm } from "@/components/members/Forms";
import s from "@/components/members/members.module.css";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default async function NewPasswordPage({ searchParams }: PageProps<"/espace-partenaires/mot-de-passe/nouveau">) {
  const { token } = await searchParams;
  return (
    <main className={`${s.main} ${s.narrow}`}>
      <h1 className={s.title}>Votre mot de passe</h1>
      {typeof token === "string" && token ? (
        <SetPasswordForm token={token} />
      ) : (
        <p className={s.lead}>
          Ce lien est incomplet. <Link href="/espace-partenaires/mot-de-passe">Demandez-en un nouveau</Link>.
        </p>
      )}
    </main>
  );
}
