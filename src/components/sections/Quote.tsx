"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Lines } from "@/components/motion/Lines";
import type { Quote as QuoteData } from "@/content/schema";
import s from "./Quote.module.css";

/** Full-screen breath between chapters: one quote, the year it guided, sliding behind. */
export function Quote({ quote }: { quote: QuoteData }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          `.${s.year}`,
          { xPercent: 20 },
          { xPercent: -20, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          `.${s.rule}`,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 60%", once: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.quote} aria-label={`Citation de ${quote.author}`}>
      {quote.year && (
        <span className={s.year} aria-hidden>
          {quote.year}
        </span>
      )}
      <figure className={s.figure}>
        <blockquote>
          <Lines lines={quote.lines} accent={quote.lines.length - 1} className={s.text} />
        </blockquote>
        <span className={s.rule} aria-hidden />
        <figcaption className={`${s.caption} mono`}>
          <span>{quote.author}</span>
          {quote.context && <span className={s.context}>{quote.context}</span>}
        </figcaption>
      </figure>
    </section>
  );
}
