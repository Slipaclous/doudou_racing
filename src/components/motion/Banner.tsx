"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import s from "./Banner.module.css";

/**
 * Giant scrolling band between sections. Drifts on its own, speeds up with the scroll
 * and follows its direction (scroll up, it runs backwards).
 */
export function Banner({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(`.${s.track}`, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
        // Start deep into the loop so it can also run backwards.
        loop.totalTime(loop.duration() * 100);

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const dir = self.direction;
            const boost = Math.min(Math.abs(self.getVelocity()) / 250, 10);
            gsap.to(loop, {
              timeScale: dir * (1 + boost),
              duration: 0.15,
              overwrite: true,
              onComplete: () => void gsap.to(loop, { timeScale: dir, duration: 1, ease: "power2.out", overwrite: true }),
            });
          },
        });
        return () => st.kill();
      });
    },
    { scope: root },
  );

  const line = (
    <>
      {items.map((item, i) => (
        <span key={i} className={s.item}>
          {item}
          <span className={s.sep} aria-hidden>
            ◆
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div ref={root} className={s.banner} aria-label={items.join(", ")} role="marquee">
      <div className={s.track} aria-hidden>
        {/* Two copies of two copies: the band is always wider than the screen, the loop never shows a gap. */}
        {line}
        {line}
        {line}
        {line}
      </div>
    </div>
  );
}
