import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/actions/members";
import { getMember } from "@/members/session";
import s from "@/components/members/members.module.css";

export const metadata: Metadata = {
  title: { default: "Espace partenaires — #105", template: "%s — Espace partenaires #105" },
  robots: { index: false, follow: false },
};

export default async function PartnerAreaLayout({ children }: LayoutProps<"/espace-partenaires">) {
  const member = await getMember();
  return (
    <div className={s.shell}>
      <header className={s.header}>
        <Link href={member ? "/espace-partenaires" : "/"} className={s.brand}>
          <span>#105</span> Espace partenaires
        </Link>
        <nav className={`${s.nav} mono`} aria-label="Espace partenaires">
          {member ? (
            <>
              <Link href="/espace-partenaires">Annuaire</Link>
              <Link href="/espace-partenaires/courses">Courses</Link>
              <Link href="/espace-partenaires/profil">Mon profil</Link>
              <form action={logout}>
                <button type="submit" className={`${s.linkButton} mono`}>Déconnexion</button>
              </form>
            </>
          ) : (
            <Link href="/">← Retour au site</Link>
          )}
        </nav>
      </header>
      {children}
    </div>
  );
}
