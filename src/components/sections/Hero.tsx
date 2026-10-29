"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site } from "@/content/schema";
import s from "./Hero.module.css";

export function Hero({ pilot, alts }: { pilot: Site["pilot"]; alts: Record<string, string> }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Autoplay ignores reduced motion: stop the video ourselves.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.current?.querySelector("video")?.pause();
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=150%", scrub: 0.6, pin: true },
        });
        // The image opens like a helmet visor, while the name splits apart.
        tl.fromTo(
          `.${s.visor}`,
          { clipPath: "polygon(0 6%, 100% 2%, 100% 98%, 0 94%)" },
          { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", ease: "none" },
          0,
        )
          .fromTo(`.${s.media}`, { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
          .to(`.${s.lineTop}`, { xPercent: -60, ease: "none" }, 0)
          .to(`.${s.lineBottom}`, { xPercent: 60, ease: "none" }, 0)
          .fromTo(`.${s.number}`, { yPercent: 110 }, { yPercent: 0, ease: "power2.out" }, 0.45)
          .fromTo(`.${s.tagline}`, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none" }, 0.6);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.hero} aria-label="Introduction">
      <div className={s.visor}>
        {pilot.heroVideo ? (
          <video className={s.media} src={pilot.heroVideo} poster={pilot.heroPoster} preload="metadata" autoPlay muted loop playsInline />
        ) : (
          <Image className={s.media} src={pilot.heroPoster} alt={alts[pilot.heroPoster] ?? ""} fill priority sizes="100vw" />
        )}
      </div>

      <h1 className={s.name}>
        <span className={s.lineTop}>{pilot.firstName}</span>
        <span className={s.lineBottom}>{pilot.nickname}</span>
      </h1>

      <div className={s.numberWrap} aria-label={`Numéro ${pilot.number}`}>
        <span className={s.number}>{pilot.number}</span>
      </div>

      <p className={`${s.tagline} mono`}>{pilot.tagline}</p>
    </section>
  );
}
