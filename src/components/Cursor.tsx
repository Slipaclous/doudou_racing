"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import s from "./Cursor.module.css";

/**
 * Custom cursor: a dot that sticks to the mouse (no smoothing) and opens into a ring over links and buttons.
 * Mouse/trackpad only, never with reduced motion; the system cursor stays everywhere else.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dot.current;
    const ok = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!el || !ok.matches) return;

    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickSetter(el, "x", "px");
    const y = gsap.quickSetter(el, "y", "px");

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.dataset.visible = "true";
      el.dataset.hover = String(Boolean((e.target as Element).closest("a, button, summary, label, [role=button]")));
    };
    const leave = () => (el.dataset.visible = "false");
    const down = () => (el.dataset.down = "true");
    const up = () => (el.dataset.down = "false");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return <div ref={dot} className={s.cursor} aria-hidden data-visible="false" />;
}
