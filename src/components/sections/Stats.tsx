"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site } from "@/content/schema";
import s from "./Stats.module.css";

const MAX_DETAILS = 12;

// Stylised circuit (not a real track): straights, a hairpin and an esses section.
const TRACK =
  "M140 470 L620 470 C700 470 720 420 690 370 L600 240 C570 195 600 140 655 140 L820 140 C880 140 900 190 870 235 L820 310 C795 350 830 390 870 380 C940 370 960 430 920 480 C880 530 800 540 740 540 L160 540 C90 540 60 500 80 450 L180 180 C200 120 260 100 300 140 L420 270 C450 300 440 340 400 350 L220 400 C170 415 150 440 140 470 Z";

export function Stats({ stats }: { stats: Site["stats"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const line = root.current!.querySelector<SVGPathElement>(`.${s.lap}`)!;
      const length = line.getTotalLength();

      // Sector markers, evenly spaced along the lap (S1 at the start line).
      gsap.utils.toArray<SVGGElement>(`.${s.sector}`).forEach((g, i) => {
        const p = line.getPointAtLength((length * i) / stats.length);
        g.setAttribute("transform", `translate(${p.x} ${p.y})`);
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const n = stats.length;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${n * 80}%`, scrub: 0.5, pin: true },
        });

        // One lap over the whole section: the red line draws itself, the #105 kart follows it.
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(line, { strokeDashoffset: 0, duration: n }, 0).to(
          `.${s.kart}`,
          { duration: n, motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5], autoRotate: true } },
          0,
        );

        gsap.utils.toArray<HTMLElement>(`.${s.stat}`).forEach((el, i) => {
          const num = el.querySelector<HTMLElement>(`.${s.value}`)!;
          const items = el.querySelectorAll(`.${s.detail}`);
          const counter = { v: 0 };

          if (i > 0) {
            const prev = el.previousElementSibling;
            tl.to(prev, { yPercent: -40, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, i).fromTo(
              el,
              { yPercent: 40, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.25, ease: "power2.out" },
              i + 0.1,
            );
          }
          tl.to(`.${s.sector}:nth-of-type(${i + 1})`, { "--on": 1, duration: 0.1 }, i)
            .to(
              counter,
              {
                v: Number(num.dataset.value),
                duration: 0.6,
                onUpdate: () => {
                  num.textContent = String(Math.round(counter.v));
                },
              },
              i + 0.15,
            );
          // The proof stacks up while the number climbs (some stats have no details).
          if (items.length) {
            tl.fromTo(items, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, stagger: 0.6 / items.length, duration: 0.05 }, i + 0.15);
          }
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="chiffres" className={s.stats} aria-labelledby="stats-title">
      <svg className={s.circuit} viewBox="0 0 1000 600" aria-hidden preserveAspectRatio="xMidYMid meet">
        <path d={TRACK} className={s.asphalt} />
        <path d={TRACK} className={s.kerbs} />
        <path d={TRACK} className={s.lap} />
        <line x1="140" y1="448" x2="140" y2="492" className={s.startLine} />
        {stats.map((_, i) => (
          <g key={i} className={s.sector}>
            <circle r="9" />
            <text x="16" y="-14">S{i + 1}</text>
          </g>
        ))}
        <g className={s.kart}>
          <polygon points="-16,-11 16,0 -16,11 -9,0" />
        </g>
      </svg>

      <h2 id="stats-title" className={`${s.label} mono`}>
        En chiffres
      </h2>

      <div className={s.list}>
        {stats.map((stat, i) => {
          const shown = stat.details.slice(0, MAX_DETAILS);
          const more = stat.details.length - shown.length;
          return (
            <div key={stat.label} className={s.stat}>
              <span className={`${s.sectorTag} mono`}>
                Secteur {i + 1} / {stats.length}
              </span>
              <span className={s.value} data-value={stat.value}>
                {stat.value}
              </span>
              <span className={s.name}>{stat.label}</span>
              {shown.length > 0 && (
                <ol className={`${s.details} mono`}>
                  {shown.map((d, j) => (
                    <li key={`${d}-${j}`} className={s.detail}>
                      <span className={s.detailIndex}>{String(j + 1).padStart(2, "0")}</span> {d}
                    </li>
                  ))}
                  {more > 0 && <li className={s.detail}>+ {more}</li>}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
