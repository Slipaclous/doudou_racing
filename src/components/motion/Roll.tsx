/**
 * Hover text roll: the label leaves upward while a copy rises from below.
 * The animation is driven by the parent link or button (see .roll in globals.css).
 */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden>
        {children}
      </span>
    </span>
  );
}
