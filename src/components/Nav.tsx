"use client";

import { useEffect, useState } from "react";
import { Roll } from "@/components/motion/Roll";
import s from "./Nav.module.css";

const links = [
  { href: "#courses", label: "Courses" },
  { href: "#pourquoi", label: "Pourquoi" },
  { href: "#partenaires", label: "Partenaires" },
];

type Mode = "top" | "shown" | "hidden";

export function Nav({ number }: { number: number }) {
  const [mode, setMode] = useState<Mode>("top");

  // Hide while reading down, come back on the slightest scroll up (solid, so it never sits on text).
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y < 80) setMode("top");
      else if (Math.abs(y - last) > 6) setMode(y > last ? "hidden" : "shown");
      last = y;
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
    <header className={s.nav} data-mode={mode}>
      <a href="#top" className={s.logo} aria-label="Retour en haut">
        #{number}
      </a>
      <nav aria-label="Principale" className={s.links}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="mono">
            <Roll>{l.label}</Roll>
          </a>
        ))}
      </nav>
      <a href="#contact" className={s.cta}>
        <Roll>Devenir partenaire</Roll>
      </a>
    </header>
  );
}
