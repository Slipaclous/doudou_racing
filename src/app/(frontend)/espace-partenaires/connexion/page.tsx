import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/members/Forms";
import { getMember } from "@/members/session";
import s from "@/components/members/members.module.css";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await getMember()) redirect("/espace-partenaires");
  return (
    <main className={`${s.main} ${s.narrow}`}>
      <h1 className={s.title}>Connexion</h1>
      <p className={s.lead}>L&apos;annuaire réservé aux partenaires de l&apos;écurie #105.</p>
      <LoginForm />
      <p className={s.small}>
        Première visite ou mot de passe oublié ? <Link href="/espace-partenaires/mot-de-passe">Recevoir un lien par e-mail</Link>
      </p>
      <p className={s.small}>Pas encore de compte ? Demandez-le à l&apos;équipe #105.</p>
    </main>
  );
}
