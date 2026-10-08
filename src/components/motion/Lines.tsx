"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import s from "./Lines.module.css";

/**
 * Text revealed line by line from behind a mask (no fade): each line slides up out of its own clip.
 * Lines are given explicitly so breaks stay where the design wants them.
 */
export function Lines({
  lines,
  as: Tag = "p",
  className,
  accent,
  id,
  delay = 0,
}: {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  accent?: number;
  id?: string;
  delay?: number;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          `.${s.line}`,
          { yPercent: 105, rotate: 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            delay,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={s.mask}>
          <span className={`${s.line} ${i === accent ? s.accent : ""}`}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
