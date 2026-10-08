"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site } from "@/content/schema";
import { pilotSheet } from "@/content/story";
import { Lines } from "@/components/motion/Lines";
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

  const tabs: { id: string; label: string; facts: [string, string][] }[] = [
    {
      id: "infos",
      label: "Infos générales",
      facts: [
        ["Date de naissance", pilotSheet.birth],
        ["Ville natale", pilotSheet.birthplace],
        ["Nationalité", pilot.nationality],
        ["Premier kart", pilotSheet.firstKart],
        ["Taille", pilotSheet.height],
        ["Poids", pilotSheet.weight],
      ],
    },
    {
      id: "course",
      label: "En course",
      facts: [
        ["Numéro", `#${pilot.number}`],
        ["Catégorie", pilot.category],
        ["Équipe", pilot.team],
        ["Âge", `${pilot.age} ans`],
        ["Premier mentor", pilotSheet.mentor],
      ],
    },
  ];
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section ref={root} id="pilote" className={s.pilot} aria-labelledby="pilot-title">
      <Lines as="h2" id="pilot-title" className={s.title} lines={["Le pilote"]} />
      <p className={s.text}>
        {words.map((w, i) => (
          <span key={i} className={s.word}>{w} </span>
        ))}
      </p>

      <div className={s.sheet}>
        <div role="tablist" aria-label="Fiche pilote" className={s.tabs} onKeyDown={onKey}>
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={i === active ? 0 : -1}
              className={`${s.tab} mono`}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map((tab, i) => (
          <dl
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={i !== active}
            className={s.facts}
          >
            {tab.facts.map(([k, v], j) => (
              <div key={k} className={s.fact} style={{ "--i": j } as React.CSSProperties}>
                <dt className="mono">{k}</dt>
                <dd className={`${s.value} display`}>
                  <span>{v}</span>
                </dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
    </section>
  );
}
