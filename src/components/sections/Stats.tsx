"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Site } from "@/content/schema";
import s from "./Stats.module.css";

const MAX_DETAILS = 12;

// Karting des Fagnes, Mariembourg (BE): main loop traced from OpenStreetMap (way 94517023, © OpenStreetMap contributors),
// smoothed and fitted to the 1000×600 viewBox. The lap starts on the main straight, in the race direction.
const TRACK =
  "M474 81 C498 78 527 77 550 75 C573 73 591 72 612 70 C632 69 636 67 673 66 C710 65 798 64 835 64 C871 64 875 62 891 67 C907 73 923 85 931 97 C939 108 937 125 938 138 C940 151 946 160 940 175 C934 190 934 202 900 229 C867 256 775 314 738 336 C701 359 695 359 678 365 C662 372 650 373 640 373 C630 373 623 372 617 365 C611 359 605 345 603 334 C601 322 604 307 605 296 C606 286 607 279 610 272 C613 265 612 259 623 255 C633 250 658 245 674 244 C690 243 705 249 719 249 C733 248 741 246 756 241 C771 235 793 227 807 217 C822 207 836 191 844 180 C853 168 856 158 856 148 C856 138 854 123 842 118 C830 113 800 117 783 118 C767 118 762 119 743 120 C725 121 696 121 671 123 C647 125 612 129 597 130 C582 131 588 130 580 130 C572 130 563 129 552 129 C541 129 525 127 513 130 C501 133 485 137 480 148 C476 159 477 157 485 195 C494 233 524 341 533 377 C542 413 541 401 539 412 C538 423 548 425 523 443 C499 462 420 509 391 525 C361 540 362 535 347 536 C331 537 313 533 297 529 C282 525 262 518 254 510 C246 503 249 496 248 487 C248 477 247 462 252 454 C257 446 269 442 278 441 C286 439 293 443 303 446 C313 449 327 458 337 461 C347 464 349 469 362 466 C374 464 396 453 411 446 C426 439 443 432 451 423 C459 414 463 403 461 390 C458 378 444 361 435 349 C426 336 411 327 406 316 C400 305 404 296 403 283 C402 270 401 248 399 236 C396 225 396 218 389 213 C382 209 373 210 356 211 C339 211 306 213 288 216 C270 218 257 218 249 226 C242 233 237 250 243 261 C249 272 272 281 283 289 C294 297 304 302 309 310 C314 318 316 331 313 338 C310 345 304 346 290 354 C276 361 241 379 226 383 C211 388 208 384 200 381 C191 379 186 388 174 369 C162 350 147 306 128 266 C109 227 73 160 62 132 C50 104 59 108 60 98 C61 89 62 82 66 76 C71 71 74 68 87 66 C101 64 132 62 148 64 C165 66 171 68 184 78 C196 88 206 113 223 124 C239 135 264 140 283 143 C301 145 317 141 333 138 C350 135 372 129 382 123 C392 117 390 110 393 104 C397 99 389 93 402 90 C416 86 449 83 474 81 Z";

export function Stats({ stats }: { stats: Site["stats"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const line = root.current!.querySelector<SVGPathElement>(`.${s.lap}`)!;
      const length = line.getTotalLength();

      // Sector markers, evenly spaced along the lap (S1 at the start line).
      gsap.utils.toArray<SVGGElement>(`.${s.sector}`).forEach((g, i) => {
        const p = line.getPointAtLength((length * i) / stats.length);
        g.setAttribute("transform", `translate(${p.x} ${p.y})`);
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const n = stats.length;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${n * 80}%`, scrub: 0.5, pin: true },
        });

        // One lap over the whole section: the red line draws itself, the #105 kart follows it.
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        // The arrow rides the tip of the line: same progress, position and heading read from the path itself.
        const kart = root.current!.querySelector<SVGGElement>(`.${s.kart}`)!;
        const lap = { p: 0 };
        const placeKart = () => {
          const at = lap.p * length;
          const here = line.getPointAtLength(at);
          const ahead = line.getPointAtLength(Math.min(at + 4, length));
          const behind = line.getPointAtLength(Math.max(at - 4, 0));
          const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
          kart.setAttribute("transform", `translate(${here.x} ${here.y}) rotate(${angle})`);
        };
        placeKart();
        tl.to(line, { strokeDashoffset: 0, duration: n }, 0).to(lap, { p: 1, duration: n, onUpdate: placeKart }, 0);

        gsap.utils.toArray<HTMLElement>(`.${s.stat}`).forEach((el, i) => {
          const num = el.querySelector<HTMLElement>(`.${s.value}`)!;
          const items = el.querySelectorAll(`.${s.detail}`);
          const counter = { v: 0 };

          if (i > 0) {
            const prev = el.previousElementSibling;
            tl.to(prev, { yPercent: -40, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, i).fromTo(
              el,
              { yPercent: 40, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.25, ease: "power2.out" },
              i + 0.1,
            );
          }
          tl.to(`.${s.sector}:nth-of-type(${i + 1})`, { "--on": 1, duration: 0.1 }, i)
            .to(
              counter,
              {
                v: Number(num.dataset.value),
                duration: 0.6,
                onUpdate: () => {
                  num.textContent = String(Math.round(counter.v));
                },
              },
              i + 0.15,
            );
          // The proof stacks up while the number climbs (some stats have no details).
          if (items.length) {
            tl.fromTo(items, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, stagger: 0.6 / items.length, duration: 0.05 }, i + 0.15);
          }
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="chiffres" className={s.stats} aria-labelledby="stats-title">
      <svg className={s.circuit} viewBox="0 0 1000 600" aria-hidden preserveAspectRatio="xMidYMid meet">
        <path d={TRACK} className={s.asphalt} />
        <path d={TRACK} className={s.kerbs} />
        <path d={TRACK} className={s.lap} />
        <line x1="472" y1="59" x2="476" y2="103" className={s.startLine} />
        {stats.map((_, i) => (
          <g key={i} className={s.sector}>
            <circle r="9" />
            <text x="16" y="-14">S{i + 1}</text>
          </g>
        ))}
        <g className={s.kart}>
          <polygon points="-16,-11 16,0 -16,11 -9,0" />
        </g>
      </svg>

      <h2 id="stats-title" className={`${s.label} mono`}>
        En chiffres
      </h2>

      <div className={s.list}>
        {stats.map((stat, i) => {
          const shown = stat.details.slice(0, MAX_DETAILS);
          const more = stat.details.length - shown.length;
          return (
            <div key={stat.label} className={s.stat}>
              <span className={`${s.sectorTag} mono`}>
                Secteur {i + 1} / {stats.length}
              </span>
              <span className={s.value} data-value={stat.value}>
                {stat.value}
              </span>
              <span className={s.name}>{stat.label}</span>
              {shown.length > 0 && (
                <ol className={`${s.details} mono`}>
                  {shown.map((d, j) => (
                    <li key={`${d}-${j}`} className={s.detail}>
                      <span className={s.detailIndex}>{String(j + 1).padStart(2, "0")}</span> {d}
                    </li>
                  ))}
                  {more > 0 && <li className={s.detail}>+ {more}</li>}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
