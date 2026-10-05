"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site, Zone } from "@/content/schema";
import s from "./Partners.module.css";

const tierLabel: Record<Site["partners"][number]["tier"], string> = {
  principal: "Partenaire principal",
  officiel: "Partenaire officiel",
  fournisseur: "Fournisseur",
};

/** Top view of a kart, nose to the right. Sponsor zones carry data-zone. */
function Kart({ number }: { number: number }) {
  return (
    <svg className={s.kart} viewBox="0 0 1000 520" role="img" aria-label="Vue du dessus du kart et des emplacements sponsor">
      {/* Chassis tubes */}
      <g stroke="#3a3a3a" strokeWidth="10" fill="none" strokeLinecap="square">
        <path d="M150 140 H850 M150 380 H850 M230 140 V380 M770 140 V380 M500 160 V360" />
      </g>
      {/* Wheels */}
      <g fill="#050505" stroke="#555" strokeWidth="4">
        <rect x="130" y="20" width="170" height="90" />
        <rect x="130" y="410" width="170" height="90" />
        <rect x="730" y="40" width="120" height="70" />
        <rect x="730" y="410" width="120" height="70" />
      </g>
      {/* Seat and steering wheel */}
      <path d="M380 200 H520 L540 260 L520 320 H380 Z" fill="#1c1c1c" stroke="#555" strokeWidth="4" />
      <circle cx="610" cy="260" r="38" fill="none" stroke="#555" strokeWidth="10" />

      {/* Sponsor zones */}
      <g className={s.zone} data-zone="rear">
        <path d="M40 120 H110 V400 H40 Z" />
      </g>
      <g className={s.zone} data-zone="pods">
        <path d="M330 110 H700 L680 160 H350 Z" />
        <path d="M330 410 H700 L680 360 H350 Z" />
      </g>
      <g className={s.zone} data-zone="nose">
        <path d="M790 150 H900 L960 210 V310 L900 370 H790 Z" />
      </g>
      <g className={s.zone} data-zone="plate">
        <path d="M680 205 H760 V315 H680 Z" />
        <text x="720" y="276" textAnchor="middle" className={s.plateNum}>
          {number}
        </text>
      </g>
    </svg>
  );
}

export function Partners({ partners, zones, number }: { partners: Site["partners"]; zones: Zone[]; number: number }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: `.${s.showcase}`, start: "top top", end: `+=${zones.length * 60}%`, scrub: 0.4, pin: true },
        });
        // Light up one zone at a time, synced with its description.
        zones.forEach((zone, i) => {
          const shape = `.${s.zone}[data-zone="${zone.id}"]`;
          const item = `.${s.zoneItem}[data-zone="${zone.id}"]`;
          tl.to(shape, { fill: "#e10600", ease: "none", duration: 0.3 }, i)
            .fromTo(item, { opacity: 0.25, x: 0 }, { opacity: 1, x: 24, ease: "none", duration: 0.3 }, i);
          if (i < zones.length - 1) {
            tl.to(shape, { fill: "#2a2a2a", duration: 0.2 }, i + 0.8).to(item, { opacity: 0.25, x: 0, duration: 0.2 }, i + 0.8);
          }
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="partenaires" className={s.partners} aria-labelledby="partners-title">
      <div className={s.showcase}>
        <h2 id="partners-title" className={s.title}>
          Votre logo
          <br />
          <span className={s.accent}>en piste</span>
        </h2>
        <Kart number={number} />
        <ol className={s.zones}>
          {zones.map((zone) => (
            <li key={zone.id} className={s.zoneItem} data-zone={zone.id}>
              <h3 className={s.zoneLabel}>{zone.label}</h3>
              <p>{zone.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.current}>
        <p className={`${s.currentLabel} mono`}>Ils roulent déjà avec nous</p>
        <ul className={s.list}>
          {partners.map((p) => (
            <li key={p.name} className={`${s.partner} ${p.tier === "principal" ? s.featured : ""}`}>
              <div className={`${s.partnerMeta} mono`}>
                <span className={s.partnerRole}>{p.role ?? tierLabel[p.tier]}</span>
                {p.sector && <span>{p.sector}</span>}
              </div>
              {p.logo ? (
                <Image src={p.logo} alt={p.name} width={320} height={120} className={s.logo} />
              ) : (
                <h3 className={s.partnerName}>{p.name}</h3>
              )}
              {p.description && <p className={s.partnerText}>{p.description}</p>}
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className={`${s.partnerLink} mono`}>
                  Site web <span aria-hidden>↗</span>
                  <span className="sr-only"> de {p.name}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
