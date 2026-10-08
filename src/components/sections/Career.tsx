"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Season } from "@/content/schema";
import { Lines } from "@/components/motion/Lines";
import s from "./Career.module.css";

export function Career({ seasons }: { seasons: Season[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        // Images drift inside their frames and years rise, tied to the horizontal motion.
        gsap.utils.toArray<HTMLElement>(`.${s.panel}`).forEach((panel) => {
          const trigger = { trigger: panel, containerAnimation: scroll, scrub: true };
          gsap.fromTo(
            panel.querySelector("img"),
            { xPercent: -12 },
            { xPercent: 12, ease: "none", scrollTrigger: { ...trigger, start: "left right", end: "right left" } },
          );
          // Colour comes in as the photo reaches the centre, and drains away as it leaves.
          gsap
            .timeline({ scrollTrigger: { ...trigger, start: "left 85%", end: "right 15%" } })
            .fromTo(panel.querySelector("img"), { filter: "grayscale(1) contrast(1.15)" }, { filter: "grayscale(0) contrast(1.05)", ease: "power1.out", duration: 1 })
            .to(panel.querySelector("img"), { filter: "grayscale(0) contrast(1.05)", duration: 1 })
            .to(panel.querySelector("img"), { filter: "grayscale(1) contrast(1.15)", ease: "power1.in", duration: 1 });
          gsap.fromTo(
            panel.querySelector(`.${s.year}`),
            { yPercent: 40 },
            { yPercent: -10, ease: "none", scrollTrigger: { ...trigger, start: "left right", end: "center center" } },
          );
        });
      });

      // Phones: vertical stack, same colour pass as each photo crosses the screen.
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(`.${s.frame} img`).forEach((img) => {
          gsap
            .timeline({ scrollTrigger: { trigger: img, start: "top 85%", end: "bottom 15%", scrub: true } })
            .fromTo(img, { filter: "grayscale(1) contrast(1.15)" }, { filter: "grayscale(0) contrast(1.05)", duration: 1 })
            .to(img, { filter: "grayscale(0) contrast(1.05)", duration: 1 })
            .to(img, { filter: "grayscale(1) contrast(1.15)", duration: 1 });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="parcours" className={s.career} aria-labelledby="career-title">
      <div ref={track} className={s.track}>
        <div className={s.intro}>
          <Lines as="h2" id="career-title" className={s.title} lines={["Le", "parcours"]} />
          <p className="mono">{seasons[0]?.year} → aujourd&apos;hui</p>
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
                sizes="(min-width: 768px) 45vw, 100vw"
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
    </section>
  );
}
