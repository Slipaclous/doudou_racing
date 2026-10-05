import s from "./Nav.module.css";

const links = [
  { href: "#courses", label: "Courses" },
  { href: "#pourquoi", label: "Pourquoi" },
  { href: "#partenaires", label: "Partenaires" },
];

export function Nav({ number }: { number: number }) {
  return (
    <header className={s.nav}>
      <a href="#top" className={s.logo} aria-label="Retour en haut">
        #{number}
      </a>
      <nav aria-label="Principale" className={s.links}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="mono">
            {l.label}
          </a>
        ))}
      </nav>
      <a href="#contact" className={s.cta}>
        Devenir partenaire
      </a>
    </header>
  );
}
