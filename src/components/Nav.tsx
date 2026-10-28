"use client";

import { useEffect, useRef, useState } from "react";
import { Roll } from "@/components/motion/Roll";
import type { Texts } from "@/content/texts";
import s from "./Nav.module.css";

// Full-screen menu: every section of the page, in reading order. Labels come from "Réglages du site".
const sections: { href: string; key: keyof Texts["menu"] }[] = [
  { href: "#pilote", key: "pilote" },
  { href: "#parcours", key: "parcours" },
  { href: "#la-suite", key: "suite" },
  { href: "#chiffres", key: "chiffres" },
  { href: "#courses", key: "courses" },
  { href: "#aventure", key: "aventure" },
  { href: "/galerie", key: "galerie" },
  { href: "#partenaires", key: "partenaires" },
  { href: "#contact", key: "contact" },
];

type Mode = "top" | "shown";

// SmoothScroll (Lenis) listens to these: the page must not scroll behind the open menu.
const setScrollLock = (locked: boolean) => window.dispatchEvent(new Event(locked ? "scroll:lock" : "scroll:unlock"));

export function Nav({ number, texts }: { number: number; texts: Texts["menu"] }) {
  const [mode, setMode] = useState<Mode>("top");
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setScrollLock(open);
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Always visible (calls to action and menu stay at hand); turns solid once the page scrolls, so it never sits on text.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setMode(window.scrollY < 80 ? "top" : "shown");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <header className={s.nav} data-mode={mode} data-menu={open ? "open" : "closed"}>
        <a href="#top" className={s.logo} aria-label="Retour en haut" onClick={() => setOpen(false)}>
          #{number}
        </a>
        <div className={s.end}>
          <a href="/espace-partenaires" className={`${s.member} mono`}>
            <Roll>{texts.member}</Roll>
          </a>
          <a href="#contact" className={s.cta}>
            <Roll>{texts.cta}</Roll>
          </a>
          <button
            type="button"
            className={`${s.burger} mono`}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={s.burgerIcon} aria-hidden />
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </header>

      <div id="site-menu" className={s.menu} data-open={open} inert={!open}>
        <nav aria-label="Toutes les sections" className={s.menuNav}>
          <ol className={s.menuList}>
            {sections.map((l, i) => (
              <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                <a ref={i === 0 ? firstLink : undefined} href={l.href} className={s.menuLink} onClick={() => setOpen(false)}>
                  <span className={`${s.menuIndex} mono`}>{String(i + 1).padStart(2, "0")}</span>
                  <Roll>{texts[l.key]}</Roll>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.menuFoot}>
          <a href="#contact" className={s.cta} onClick={() => setOpen(false)}>
            <Roll>{texts.cta}</Roll>
          </a>
          <a href="/espace-partenaires" className={`${s.member} ${s.memberAlways} mono`}>
            <Roll>{texts.member}</Roll>
          </a>
        </div>
        <span className={s.menuNumber} aria-hidden>
          {number}
        </span>
      </div>
    </>
  );
}
