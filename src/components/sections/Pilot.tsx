"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site } from "@/content/schema";
import s from "./Pilot.module.css";

export function Pilot({ pilot }: { pilot: Site["pilot"] }) {
  const root = useRef<HTMLElement>(null);
  const words = pilot.bio.join(" ").split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Words light up one by one: reading pace follows scroll pace.
        gsap.fromTo(
          `.${s.word}`,
          { color: "#3a3a3a" },
          {
            color: "#f5f3ef",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: `.${s.text}`, start: "top 75%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  const facts: [string, string][] = [
    ["Âge", `${pilot.age} ans`],
    ["Catégorie", pilot.category],
    ["Équipe", pilot.team],
    ["Numéro", `#${pilot.number}`],
  ];

  return (
    <section ref={root} id="pilote" className={s.pilot} aria-labelledby="pilot-title">
      <h2 id="pilot-title" className={s.title}>Le pilote</h2>
      <p className={s.text}>
        {words.map((w, i) => (
          <span key={i} className={s.word}>{w} </span>
        ))}
      </p>
      <dl className={s.facts}>
        {facts.map(([k, v]) => (
          <div key={k} className={s.fact}>
            <dt className="mono">{k}</dt>
            <dd className="display">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
