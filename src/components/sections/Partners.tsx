"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site, Zone } from "@/content/schema";
import { Lines } from "@/components/motion/Lines";
import { Roll } from "@/components/motion/Roll";
import s from "./Partners.module.css";

type Partner = Site["partners"][number];

const tierLabel: Record<Partner["tier"], string> = {
  principal: "Partenaire principal",
  officiel: "Partenaire officiel",
  fournisseur: "Fournisseur",
};

/** Partner logo turned white on the dark page: client logos are JPGs with a white box. */
function Logo({ partner, className }: { partner: Partner; className: string }) {
  return partner.logo ? (
    <Image src={partner.logo} alt="" width={320} height={180} className={className} />
  ) : (
    <span className={`${className} ${s.logoText}`}>{partner.name}</span>
  );
}

function PartnerRow({ partner: p, className, compact = false }: { partner: Partner; className: string; compact?: boolean }) {
  const inner = (
    <>
      {/* In the index "officiel" is the default: only other tiers or a custom role get a label. */}
      {(!compact || p.role || p.tier !== "officiel") && <span className={`${s.rowTier} mono`}>{p.role ?? tierLabel[p.tier]}</span>}
      <span className={s.rowName}>{p.name}</span>
      {p.sector && <span className={`${s.rowSector} mono`}>{p.sector}</span>}
      {!compact && <Logo partner={p} className={s.rowLogo} />}
      {p.url && <span className={s.rowArrow} aria-hidden>↗</span>}
    </>
  );
  return (
    <li className={className}>
      {p.url ? (
        <a href={p.url} target="_blank" rel="noopener noreferrer" className={s.rowInner}>
          {inner}
          <span className="sr-only"> (site web, nouvel onglet)</span>
        </a>
      ) : (
        <div className={s.rowInner}>{inner}</div>
      )}
    </li>
  );
}

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
  const ordered = [...partners].sort((x, y) => (x.tier === "principal" ? 0 : 1) - (y.tier === "principal" ? 0 : 1));

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
        <Lines as="h2" id="partners-title" className={s.title} lines={["Votre logo", "en piste"]} accent={1} />
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
        {/* Endless logo strip. The second copy only closes the loop, so screen readers skip it. */}
        <div className={s.marquee}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={s.track} aria-hidden={copy === 1 || undefined}>
              {ordered.map((p) => (
                <li key={p.name} className={s.trackItem}>
                  <Logo partner={p} className={s.trackLogo} />
                  {copy === 0 && <span className="sr-only">{p.name}</span>}
                </li>
              ))}
            </ul>
          ))}
        </div>

        <a href="#contact" className={`${s.cta} mono`}>
          <Roll>{`Rejoindre l'équipe #${number}`}</Roll> <span aria-hidden>→</span>
        </a>

        <div className={s.roster}>
          <p className={`${s.rosterLabel} mono`}>
            Partenaires actuels <span className={s.count}>{partners.length}</span>
          </p>
          <div className={s.lists}>
            <ul className={s.rows}>
              {ordered.filter((p) => p.tier === "principal").map((p) => (
                <PartnerRow key={p.name} partner={p} className={`${s.row} ${s.rowPrincipal}`} />
              ))}
            </ul>
            {/* Everyone else as a compact index, not one tall list. */}
            <ul className={s.index}>
              {ordered.filter((p) => p.tier !== "principal").map((p) => (
                <PartnerRow key={p.name} partner={p} className={s.cell} compact />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
