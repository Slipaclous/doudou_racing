"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { SiteEvent } from "@/content/schema";
import { Roll } from "@/components/motion/Roll";
import s from "./Adventure.module.css";

// What the partner pass gives access to. Each privilege stamps the pass as it scrolls by.
const perks = [
  { word: "Vivre", stamp: "Paddock", text: "La saison au cœur de l'équipe : rallye, journées sur circuit, coulisses du paddock." },
  { word: "Inviter", stamp: "Invités", text: "Vos clients et vos équipes à des moments qu'ils n'oublieront pas." },
  { word: "Rencontrer", stamp: "Réseau", text: "Les autres entrepreneurs partenaires, pour faire grandir votre réseau." },
  { word: "Briller", stamp: "Visibilité", text: "Votre marque sur le kart, la combinaison et le casque, sur les circuits d'Europe." },
];

// Barcode bars, fixed so server and client render the same thing.
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];

type Photo = { src: string; caption?: string };

function buildPhotos(events: SiteEvent[], photos: string[]): Photo[] {
  const pool: Photo[] = [...events.map((e) => ({ src: e.image, caption: e.title })), ...photos.map((src) => ({ src }))];
  if (!pool.length) return [];
  return perks.map((_, i) => pool[i % pool.length]);
}

/**
 * "Bien plus qu'un logo", told as a paddock pass. The partner accreditation drops in on its lanyard and swings;
 * on large screens it stays beside the list while the four privileges scroll by. Each privilege opens its photo
 * and slams a stamp onto the pass. No pinning: everything follows the normal scroll.
 */
export function Adventure({ events, photos, portrait, number }: { events: SiteEvent[]; photos: string[]; portrait: string; number: number }) {
  const root = useRef<HTMLElement>(null);
  const pics = buildPhotos(events, photos);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const pass = root.current!.querySelector<HTMLElement>(`.${s.pass}`)!;
        const stamps = gsap.utils.toArray<HTMLElement>(`.${s.stamp}`);

        // The pass drops in on its lanyard and settles with a swing.
        gsap.fromTo(
          `.${s.hanger}`,
          { yPercent: -60, rotate: 14 },
          {
            yPercent: 0,
            rotate: 0,
            ease: "elastic.out(1, 0.45)",
            duration: 1.6,
            scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none reverse" },
          },
        );
        // A slow sway while the section scrolls, like a badge swinging from a neck.
        gsap.fromTo(
          `.${s.hanger}`,
          { "--sway": "-3deg" },
          { "--sway": "3deg", ease: "sine.inOut", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } },
        );

        gsap.set(stamps, { autoAlpha: 0 });
        gsap.utils.toArray<HTMLElement>(`.${s.perk}`).forEach((perk, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: perk, start: "top 65%", toggleActions: "play none none reverse" },
          });
          tl.fromTo(perk.querySelector(`.${s.word}`), { yPercent: 105 }, { yPercent: 0, duration: 0.6, ease: "power3.out" })
            .fromTo(
              perk.querySelector(`.${s.photo}`),
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.inOut" },
              0.1,
            )
            .fromTo(perk.querySelector(`.${s.perkText}`), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.3)
            // The stamp slams onto the pass: big and tilted, then flat with a little bounce, and the pass shakes.
            .fromTo(
              stamps[i],
              { autoAlpha: 0, scale: 2.4, rotate: -24 },
              { autoAlpha: 1, scale: 1, rotate: i % 2 ? 8 : -8, duration: 0.45, ease: "back.out(2.2)" },
              0.25,
            )
            .fromTo(pass, { x: 0 }, { x: 6, duration: 0.06, repeat: 3, yoyo: true, ease: "none" }, 0.62);
        });

        gsap.fromTo(
          `.${s.closing}`,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: `.${s.closing}`, start: "top 85%", toggleActions: "play none none reverse" },
          },
        );
      });

      // Mouse: the pass tilts in 3D under the pointer.
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const pass = root.current!.querySelector<HTMLElement>(`.${s.pass}`)!;
        const rx = gsap.quickTo(pass, "rotateX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(pass, "rotateY", { duration: 0.5, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = pass.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 22);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 22);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        pass.addEventListener("pointermove", move);
        pass.addEventListener("pointerleave", leave);
        return () => {
          pass.removeEventListener("pointermove", move);
          pass.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  if (!pics.length) return null;

  return (
    <section ref={root} id="aventure" className={s.adventure} aria-labelledby="adventure-title">
      <header className={s.head}>
        <p className={`${s.kicker} mono`}>Bien plus qu&apos;un logo</p>
        <h2 id="adventure-title" className={s.title}>
          Votre pass <span>pour la saison</span>
        </h2>
      </header>

      <div className={s.layout}>
        {/* The pass. Decorative: the same information is in the list next to it. */}
        <div className={s.passCol} aria-hidden>
          <div className={s.hanger}>
            <span className={s.lanyard} />
            <span className={s.clip} />
            <div className={s.pass}>
              <div className={s.passTop}>
                <span className={s.passNum}>#{number}</span>
                <span className={`${s.passSeason} mono`}>Saison 2027</span>
              </div>
              <div className={s.passPhoto}>
                <Image src={portrait} alt="" fill sizes="320px" unoptimized={portrait.endsWith(".svg")} />
              </div>
              <p className={s.passRole}>Partenaire</p>
              <p className={`${s.passName} mono`}>Votre entreprise</p>
              <div className={s.stamps}>
                {perks.map((p) => (
                  <span key={p.stamp} className={`${s.stamp} mono`}>
                    {p.stamp}
                    <small>Accès</small>
                  </span>
                ))}
              </div>
              <div className={s.barcode}>
                {BARS.map((w, i) => (
                  <span key={i} style={{ flexGrow: w }} />
                ))}
              </div>
              <p className={`${s.passFoot} mono`}>Accès paddock · All areas</p>
            </div>
          </div>
        </div>

        <ol className={s.perks}>
          {perks.map((p, i) => (
            <li key={p.word} className={s.perk}>
              <span className={`${s.perkNum} mono`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.wordMask}>
                <span className={s.word}>{p.word}</span>
              </span>
              <p className={s.perkText}>{p.text}</p>
              <div className={s.photo}>
                <Image src={pics[i].src} alt="" fill sizes="(min-width: 900px) 40vw, 90vw" unoptimized={pics[i].src.endsWith(".svg")} />
                {pics[i].caption && <span className={`${s.caption} mono`}>{pics[i].caption}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.closing}>
        <p className={s.closingText}>Votre pass vous attend.</p>
        <div className={s.actions}>
          <a href="#contact" className={s.cta}>
            <Roll>Devenir partenaire</Roll>
          </a>
          <a href="/espace-partenaires/courses" className={`${s.link} mono`}>
            <Roll>Déjà partenaire ? Les prochains rendez-vous</Roll>
          </a>
        </div>
      </div>
    </section>
  );
}
