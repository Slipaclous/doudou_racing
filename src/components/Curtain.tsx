"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import s from "./Curtain.module.css";

type State = "idle" | "cover" | "reveal";

const COVER_MS = 650;
const REVEAL_MS = 750;

/**
 * Chequered-flag curtain between pages (home ⇄ partner area): sweeps in, the next page loads behind it, sweeps out.
 * Only for same-site links to another page; anchors, /admin, new tabs and reduced motion keep the normal behaviour.
 */
export function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const covering = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (/^\/(admin|api)(\/|$)/.test(url.pathname)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Capture phase: stop before Next's <Link> handles it, we navigate once the flag covers the screen.
      e.preventDefault();
      e.stopPropagation();
      covering.current = true;
      setState("cover");
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), COVER_MS);
      // Never leave the screen covered if the navigation fails.
      window.setTimeout(() => covering.current && setState("reveal"), 4000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // New page rendered behind the flag: sweep it away.
  useEffect(() => {
    if (!covering.current) return;
    covering.current = false;
    setState("reveal");
  }, [pathname]);

  useEffect(() => {
    if (state !== "reveal") return;
    const t = window.setTimeout(() => setState("idle"), REVEAL_MS);
    return () => window.clearTimeout(t);
  }, [state]);

  return (
    <div className={s.curtain} data-state={state} aria-hidden>
      <span className={s.flag} />
    </div>
  );
}
