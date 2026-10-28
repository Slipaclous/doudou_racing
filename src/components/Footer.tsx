import { Roll } from "@/components/motion/Roll";
import s from "./Footer.module.css";

export function Footer({ number, name, email, member }: { number: number; name: string; email: string; member: string }) {
  return (
    <footer className={s.footer}>
      <p className={s.number} aria-hidden>
        {number}
      </p>
      <div className={`${s.meta} mono`}>
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <a href="/espace-partenaires">
          <Roll>{member}</Roll>
        </a>
        <a href={`mailto:${email}`}>
          <Roll>{email}</Roll>
        </a>
      </div>
    </footer>
  );
}
