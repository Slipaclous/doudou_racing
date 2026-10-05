/** Always-visible way back to the public site (header actions + top of the nav). */
export function ViewSiteAction() {
  return (
    <a href="/" target="_blank" rel="noopener" className="doudou-view-site">
      Voir le site <span aria-hidden>↗</span>
    </a>
  );
}

export function ViewSiteNavLink() {
  return (
    <a href="/" target="_blank" rel="noopener" className="doudou-nav-site">
      <span aria-hidden>←</span> Retour au site
    </a>
  );
}
