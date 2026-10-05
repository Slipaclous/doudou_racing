import s from "./Footer.module.css";

export function Footer({ number, name, email }: { number: number; name: string; email: string }) {
  return (
    <footer className={s.footer}>
      <p className={s.number} aria-hidden>
        {number}
      </p>
      <div className={`${s.meta} mono`}>
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <a href={`mailto:${email}`}>{email}</a>
      </div>
    </footer>
  );
}
