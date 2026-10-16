import type { Metadata } from "next";
import Link from "next/link";
import { ResetRequestForm } from "@/components/members/Forms";
import s from "@/components/members/members.module.css";

export const metadata: Metadata = { title: "Mot de passe" };

export default function PasswordRequestPage() {
  return (
    <main className={`${s.main} ${s.narrow}`}>
      <h1 className={s.title}>Mot de passe</h1>
      <p className={s.lead}>Indiquez l&apos;e-mail de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe.</p>
      <ResetRequestForm />
      <p className={s.small}><Link href="/espace-partenaires/connexion">← Retour à la connexion</Link></p>
    </main>
  );
}
