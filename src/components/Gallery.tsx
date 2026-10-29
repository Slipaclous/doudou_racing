"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { SiteEvent } from "@/content/schema";
import { Lines } from "@/components/motion/Lines";
import { Roll } from "@/components/motion/Roll";
import { lines, type Texts } from "@/content/texts";
import s from "./Gallery.module.css";

const typeLabel: Record<SiteEvent["type"], string> = {
  rallye: "Rallye annuel",
  partenaires: "Activité partenaires",
  paddock: "Rencontre au paddock",
  clients: "Invitation clients",
};
const dateFmt = new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Tile shapes cycle so the grid never looks like a spreadsheet: big, tall, normal, wide…
const shapes = ["big", "tall", "", "wide", "", "tall", ""] as const;

type Shot = { src: string; event: SiteEvent; index: number };

/**
 * /galerie: every partner event with its photos. Tiles open from behind a mask as they scroll in;
 * a click shows the photo full screen, arrows and Esc to browse and close.
 */
export function Gallery({ events, number, texts, alts }: { events: SiteEvent[]; number: number; texts: Texts["gallery"]; alts: Record<string, string> }) {
  const title = lines(texts.title);
  const closing = lines(texts.closing);
  const root = useRef<HTMLElement>(null);
  const shots: Shot[] = events.flatMap((event) => event.photos.map((src) => ({ src, event, index: 0 }))).map((x, i) => ({ ...x, index: i }));
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tiles = gsap.utils.toArray<HTMLElement>(`.${s.tile}`);
        gsap.set(tiles, { clipPath: "inset(100% 0 0 0)" });
        // Tiles open from the bottom in small waves as they come into view.
        ScrollTrigger.batch(tiles, {
          start: "top 92%",
          onEnter: (batch) =>
            gsap.to(batch, { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });
        // And each photo settles inside its frame while the page scrolls.
        tiles.forEach((tile) =>
          gsap.fromTo(
            tile.querySelector("img"),
            { scale: 1.2, yPercent: -6 },
            { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true } },
          ),
        );
      });
    },
    { scope: root },
  );

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [shots.length]);

  // Keyboard in the viewer; the page behind stays still.
  useEffect(() => {
    if (open === null) return;
    window.dispatchEvent(new Event("scroll:lock"));
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.dispatchEvent(new Event("scroll:unlock"));
      document.documentElement.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open === null ? null : shots[open];

  return (
    <main ref={root} className={s.gallery}>
      <header className={s.top}>
        <Link href="/" className={s.logo}>
          #{number}
        </Link>
        <Link href="/#aventure" className={`${s.back} mono`}>
          <Roll>{texts.back}</Roll>
        </Link>
      </header>

      <div className={s.head}>
        <p className={`${s.kicker} mono`}>{texts.kicker}</p>
        <Lines as="h1" className={s.title} lines={title} accent={title.length - 1} />
        <p className={s.lead}>{texts.lead}</p>
      </div>

      {events.length === 0 ? (
        <p className={s.empty}>{texts.empty}</p>
      ) : (
        events.map((event, n) => (
          <section key={`${event.date}-${event.title}`} className={s.event} aria-labelledby={`ev-${n}`}>
            <div className={s.eventHead}>
              <p className={`${s.meta} mono`}>
                <span className={s.type}>{typeLabel[event.type]}</span>
                {dateFmt.format(new Date(`${event.date}T00:00:00Z`))}
                {event.place && <> · {event.place}</>}
                {event.guests ? <> · {event.guests} invités</> : null}
              </p>
              <h2 id={`ev-${n}`} className={s.eventTitle}>
                {event.title}
              </h2>
              <p className={s.eventText}>{event.text}</p>
            </div>
            <ul className={s.grid}>
              {shots
                .filter((x) => x.event === event)
                .map((shot, i) => (
                  <li key={shot.src + i} className={`${s.tile} ${shapes[i % shapes.length] ? s[shapes[i % shapes.length]] : ""}`}>
                    <button type="button" className={s.open} onClick={() => setOpen(shot.index)} aria-label={`Agrandir la photo ${i + 1} de « ${event.title} »${alts[shot.src] ? ` : ${alts[shot.src]}` : ""}`}>
                      <Image src={shot.src} alt="" fill sizes="(min-width: 900px) 33vw, 50vw" unoptimized={shot.src.endsWith(".svg")} />
                    </button>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}

      <footer className={s.foot}>
        <p className={s.footText}>
          {closing.slice(0, -1).join(" ")} <span>{closing.at(-1)}</span>
        </p>
        <Link href="/#contact" className={s.cta}>
          <Roll>{texts.cta}</Roll>
        </Link>
      </footer>

      {current && (
        <div className={s.viewer} role="dialog" aria-modal="true" aria-label={`Photo de « ${current.event.title} »`} onClick={close}>
          <div className={s.viewerImg} onClick={(e) => e.stopPropagation()}>
            <Image key={current.src} src={current.src} alt={alts[current.src] ?? ""} fill sizes="100vw" unoptimized={current.src.endsWith(".svg")} />
          </div>
          <p className={`${s.viewerCaption} mono`}>
            {current.event.title} · {open! + 1} / {shots.length}
          </p>
          <button type="button" className={`${s.nav} ${s.prev}`} onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }} aria-label="Photo précédente">
            ←
          </button>
          <button type="button" className={`${s.nav} ${s.next}`} onClick={(e) => {
              e.stopPropagation();
              step(1);
            }} aria-label="Photo suivante">
            →
          </button>
          <button type="button" className={`${s.close} mono`} onClick={close} autoFocus>
            Fermer ✕
          </button>
        </div>
      )}
    </main>
  );
}
