"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // The full-screen menu freezes the page behind it.
    const lock = () => lenis.stop();
    const unlock = () => lenis.start();
    window.addEventListener("scroll:lock", lock);
    window.addEventListener("scroll:unlock", unlock);

    return () => {
      window.removeEventListener("scroll:lock", lock);
      window.removeEventListener("scroll:unlock", unlock);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
