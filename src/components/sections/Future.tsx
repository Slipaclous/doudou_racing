"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Goal } from "@/content/schema";
import { Lines } from "@/components/motion/Lines";
import { Roll } from "@/components/motion/Roll";
import s from "./Future.module.css";

/**
 * The seasons ahead, continuing the career timeline. A line draws itself down the section as you scroll,
 * a marker rides its tip, and each future year is revealed in dotted outline (not written yet) with its goal sliding in.
 */
export function Future({ goals, number }: { goals: Goal[]; number: number }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The road: drawn from top to bottom over the whole list.
        gsap.fromTo(
          `.${s.road}`,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: `.${s.timeline}`, start: "top 70%", end: "bottom 60%", scrub: 0.5 } },
        );
        gsap.utils.toArray<HTMLElement>(`.${s.step}`).forEach((step) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 80%", end: "top 40%", scrub: 0.6 } });
          tl.fromTo(step.querySelector(`.${s.dot}`), { scale: 0 }, { scale: 1, ease: "back.out(3)", duration: 0.2 }, 0)
            .fromTo(step.querySelector(`.${s.year}`), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.6 }, 0)
            .fromTo(step.querySelector(`.${s.goal}`), { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, ease: "power2.out", duration: 0.5 }, 0.3);
        });
        gsap.fromTo(
          `.${s.closing}`,
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: `.${s.closing}`, start: "top 90%", end: "top 60%", scrub: 0.5 } },
        );
      });
    },
    { scope: root },
  );

  if (!goals.length) return null;

  return (
    <section ref={root} id="la-suite" className={s.future} aria-labelledby="future-title">
      <header className={s.head}>
        <p className={`${s.kicker} mono`}>La suite</p>
        <Lines as="h2" id="future-title" className={s.title} lines={["La route", "est encore longue"]} accent={1} />
      </header>

      <div className={s.timeline}>
        <span className={s.road} aria-hidden />
        <ol className={s.steps}>
        {goals.map((goal) => (
          <li key={goal.year} className={s.step}>
            <span className={s.dot} aria-hidden />
            {/* Dotted outline: these seasons are still to be written. */}
            <span className={s.year} aria-hidden>
              <svg viewBox="0 0 400 130" preserveAspectRatio="xMinYMid meet">
                <text x="0" y="118">
                  {goal.year}
                </text>
              </svg>
            </span>
            <div className={s.goal}>
              <p className={`${s.meta} mono`}>
                <span className="sr-only">{goal.year} · </span>
                {goal.category}
              </p>
              <h3 className={s.name}>{goal.title}</h3>
              <p>{goal.text}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>

      <div className={s.closing}>
        <p className={s.closingText}>
          Cette suite,
          <br />
          <span>écrivons-la ensemble.</span>
        </p>
        <a href="#contact" className={s.cta}>
          <Roll>{`Rejoindre l'équipe #${number}`}</Roll>
        </a>
      </div>
    </section>
  );
}
