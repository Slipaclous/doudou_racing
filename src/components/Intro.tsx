import s from "./Intro.module.css";

const BARS = 7;

/**
 * Opening wipe: skewed red and black bars sweep off the screen, revealing the hero.
 * Pure CSS, so it plays before hydration and can never stay stuck if JS fails.
 */
export function Intro({ number }: { number: number }) {
  return (
    <div className={s.intro} aria-hidden>
      {Array.from({ length: BARS }, (_, i) => (
        <span key={i} className={s.bar} style={{ "--i": i } as React.CSSProperties} />
      ))}
      <span className={s.number}>#{number}</span>
    </div>
  );
}
