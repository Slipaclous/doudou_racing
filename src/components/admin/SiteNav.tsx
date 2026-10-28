"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navSections } from "@/admin/sections";

/** The public site, section by section, at the top of the admin menu (replaces the default groups for site content). */
export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="doudou-site-nav" aria-label="Le site, section par section">
      <p className="doudou-site-nav__head">Le site</p>
      <ol>
        {navSections.map((section, i) => {
          const active = section.links.some((l) => pathname.startsWith(l.href));
          return (
            <li key={section.title} className={active ? "is-active" : undefined}>
              <span className="doudou-site-nav__title">
                <span className="doudou-site-nav__num">{String(i + 1).padStart(2, "0")}</span>
                {section.title}
              </span>
              <ul>
                {section.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
