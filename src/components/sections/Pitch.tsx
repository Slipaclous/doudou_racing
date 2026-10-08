"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site } from "@/content/schema";
import { Lines } from "@/components/motion/Lines";
import s from "./Pitch.module.css";

// Fallback visuals when no photo is set, all borrowed from the track.
const motifs = [s.kerb, s.checker, s.speed, s.grid];
const themes = [s.dark, s.red, s.light, s.dark];

export function Pitch({ pitch, nickname }: { pitch: Site["pitch"]; nickname: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${s.card}`);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${cards.length * 70}%`, scrub: 0.6, pin: true },
        });
        // Each argument slams onto the pile; the previous one is pushed back.
        // Its visual slides in slightly later than the card, for depth.
        cards.forEach((card, i) => {
          const visual = card.querySelector(`.${s.visual}`);
          const num = card.querySelector(`.${s.num}`);
          if (i > 0) {
            tl.fromTo(card, { yPercent: 120, rotate: i % 2 ? 4 : -4 }, { yPercent: 0, rotate: i % 2 ? 1.5 : -1.5, ease: "power3.out" })
              .to(cards[i - 1], { scale: 0.92, filter: "brightness(0.5)", ease: "none" }, "<");
          }
          tl.fromTo(visual, { xPercent: 18 }, { xPercent: 0, ease: "power2.out" }, i === 0 ? 0 : "<0.1")
            .fromTo(num, { yPercent: 30 }, { yPercent: 0, ease: "power2.out" }, "<");
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="pourquoi" className={s.pitch} aria-labelledby="pitch-title">
      <Lines as="h2" id="pitch-title" className={s.title} lines={["Pourquoi", nickname]} accent={1} />

      <div className={s.stack}>
        {pitch.map((item, i) => (
          <article key={item.title} className={`${s.card} ${themes[i % themes.length]}`}>
            <div className={`${s.visual} ${item.image ? "" : motifs[i % motifs.length]}`} aria-hidden>
              {item.image && <Image src={item.image} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className={s.photo} />}
            </div>
            <span className={s.kerbEdge} aria-hidden />
            <span className={s.num} aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className={s.content}>
              <span className={`${s.index} mono`}>
                {String(i + 1).padStart(2, "0")} / {String(pitch.length).padStart(2, "0")}
              </span>
              <h3 className={s.cardTitle}>{item.title}</h3>
              <p className={s.text}>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
