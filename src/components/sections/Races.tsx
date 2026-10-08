"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Race } from "@/content/schema";
import { Lines } from "@/components/motion/Lines";
import s from "./Races.module.css";

const DAY = 86_400_000;
const monthFmt = new Intl.DateTimeFormat("fr-BE", { month: "short", timeZone: "UTC" });

const noopSubscribe = () => () => {};

function parse(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

export function Races({ races }: { races: Race[] }) {
  const root = useRef<HTMLElement>(null);
  // The page is static: "today" must come from the visitor's clock, not the build (null on the server).
  const daysToNext = useSyncExternalStore(
    noopSubscribe,
    () => {
      const now = Date.now();
      const next = races.map((r) => parse(r.date).getTime()).find((t) => t >= now - DAY);
      return next === undefined ? null : Math.max(0, Math.ceil((next - now) / DAY));
    },
    () => null,
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Rows enter like karts lining up on the grid: alternating sides, along a diagonal.
        gsap.utils.toArray<HTMLElement>(`.${s.row}`).forEach((row, i) => {
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? 30 : -30, yPercent: 20, skewX: i % 2 ? -8 : 8 },
            {
              xPercent: 0,
              yPercent: 0,
              skewX: 0,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "top 55%", scrub: 0.6 },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="courses" className={s.races} aria-labelledby="races-title">
      <header className={s.head}>
        <Lines as="h2" id="races-title" className={s.title} lines={["Prochaines", "courses"]} />
        {daysToNext !== null && (
          <p className={s.countdown}>
            <span className={s.days}>J-{daysToNext}</span>
            <span className="mono">avant le prochain départ</span>
          </p>
        )}
      </header>

      <ol className={s.grid}>
        {races.map((race, i) => {
          const d = parse(race.date);
          return (
            <li key={`${race.date}-${race.name}`} className={s.row}>
              <span className={`${s.pos} mono`}>P{i + 1}</span>
              <time className={s.date} dateTime={race.date}>
                <span className={s.day}>{d.getUTCDate()}</span>
                <span className="mono">
                  {monthFmt.format(d).replace(".", "")} {d.getUTCFullYear()}
                </span>
              </time>
              <div className={s.info}>
                <h3 className={s.name}>{race.name}</h3>
                <p className="mono">
                  {race.circuit} · {race.country} · {race.category}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
