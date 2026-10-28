"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Season } from "@/content/schema";
import { Lines } from "@/components/motion/Lines";
import { lines, type Texts } from "@/content/texts";
import s from "./Career.module.css";

// Horizontal pinned scroll only where a whole season fits on screen; keep in sync with Career.module.css.
const HORIZONTAL = "((min-width: 1024px) and (min-height: 600px))";

export function Career({ seasons, texts }: { seasons: Season[]; texts: Texts["career"] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(prefers-reduced-motion: no-preference) and ${HORIZONTAL}`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        // Scroll needed for the whole strip: shorter than the strip itself, so the timeline moves faster than the wheel.
        const SPEED = 1.7;
        const scrollLength = () => distance() / SPEED;

        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${scrollLength()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        // Scroll guide: the fill follows the progress, the hint fades once the visitor has started.
        const fill = root.current!.querySelector<HTMLElement>(`.${s.fill}`)!;
        const hint = root.current!.querySelector<HTMLElement>(`.${s.hint}`)!;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${scrollLength()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(fill, { scaleX: self.progress });
            gsap.to(hint, { autoAlpha: self.progress > 0.02 ? 0 : 1, duration: 0.3, overwrite: true });
          },
        });
        const years = gsap.utils.toArray<HTMLButtonElement>(`.${s.yearBtn}`);
        const panels = gsap.utils.toArray<HTMLElement>(`.${s.panel}`);
        // The season in the middle of the screen is the active one.
        panels.forEach((panel, i) =>
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: scroll,
            start: "left center",
            end: "right center",
            onToggle: ({ isActive }) => isActive && years.forEach((b, j) => b.toggleAttribute("data-active", j === i)),
          }),
        );
        // A click on a year scrolls to the position where that season sits centred.
        const jump = (i: number) => {
          const panel = panels[i];
          const x = gsap.utils.clamp(0, distance(), panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2);
          window.dispatchEvent(new CustomEvent("scroll:to", { detail: st.start + x / SPEED }));
        };
        const handlers = years.map((b, i) => {
          const h = () => jump(i);
          b.addEventListener("click", h);
          return h;
        });

        // Images drift inside their frames and years rise, tied to the horizontal motion.
        panels.forEach((panel) => {
          const trigger = { trigger: panel, containerAnimation: scroll, scrub: true };
          gsap.fromTo(
            panel.querySelector("img"),
            { xPercent: -12 },
            { xPercent: 12, ease: "none", scrollTrigger: { ...trigger, start: "left right", end: "right left" } },
          );
          // Photos stay in colour: they light up as they reach the centre and dim as they leave.
          gsap
            .timeline({ scrollTrigger: { ...trigger, start: "left 85%", end: "right 15%" } })
            .fromTo(panel.querySelector("img"), { filter: "brightness(0.6) saturate(0.85)" }, { filter: "brightness(1) saturate(1.05)", ease: "power1.out", duration: 1 })
            .to(panel.querySelector("img"), { filter: "brightness(1) saturate(1.05)", duration: 1 })
            .to(panel.querySelector("img"), { filter: "brightness(0.6) saturate(0.85)", ease: "power1.in", duration: 1 });
          gsap.fromTo(
            panel.querySelector(`.${s.year}`),
            { yPercent: 30 },
            { yPercent: 0, ease: "none", scrollTrigger: { ...trigger, start: "left right", end: "center center" } },
          );
        });
        return () => years.forEach((b, i) => b.removeEventListener("click", handlers[i]));
      });

      // Phones, tablets, short screens: vertical stack, same light pass as each photo crosses the screen.
      mm.add(`(prefers-reduced-motion: no-preference) and (not ${HORIZONTAL})`, () => {
        gsap.utils.toArray<HTMLElement>(`.${s.frame} img`).forEach((img) => {
          gsap
            .timeline({ scrollTrigger: { trigger: img, start: "top 85%", end: "bottom 15%", scrub: true } })
            .fromTo(img, { filter: "brightness(0.6) saturate(0.85)" }, { filter: "brightness(1) saturate(1.05)", duration: 1 })
            .to(img, { filter: "brightness(1) saturate(1.05)", duration: 1 })
            .to(img, { filter: "brightness(0.6) saturate(0.85)", duration: 1 });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="parcours" className={s.career} aria-labelledby="career-title">
      <div ref={track} className={s.track}>
        <div className={s.intro}>
          <Lines as="h2" id="career-title" className={s.title} lines={lines(texts.title)} />
          <p className="mono">{seasons[0]?.year} {texts.since}</p>
        </div>

        {seasons.map((season) => (
          <article key={season.year} className={s.panel}>
            <span className={s.year} aria-hidden>
              {season.year}
            </span>
            <div className={s.frame}>
              <Image
                src={season.image}
                alt=""
fill
                sizes="(min-width: 1024px) 45vw, (min-width: 600px) 50vw, 100vw"
                unoptimized={season.image.endsWith(".svg")}
              />
            </div>
            <div className={s.body}>
              <p className="mono">
                {season.category} · {season.year}
              </p>
              <h3 className={s.headline}>{season.headline}</h3>
              <p>{season.text}</p>
              <p className={`${s.result} mono`}>{season.result}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Scroll guide (large screens, where the section scrolls sideways): where you are, and a shortcut to each season. */}
      <nav className={s.guide} aria-label="Saisons du parcours">
        <p className={`${s.hint} mono`} aria-hidden>
          {texts.hint} <span>→</span>
        </p>
        <div className={s.rail}>
          <span className={s.fill} aria-hidden />
          <ol className={s.years}>
            {seasons.map((season) => (
              <li key={season.year}>
                <button type="button" className={`${s.yearBtn} mono`}>
                  {season.year}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </section>
  );
}
