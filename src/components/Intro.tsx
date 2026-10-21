import s from "./Intro.module.css";

const BARS = 8;

/**
 * Opening: horizontal bands split apart to the left and right, uncovering the whole hero photo.
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
