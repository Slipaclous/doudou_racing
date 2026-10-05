"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/actions/contact";
import s from "./Contact.module.css";

const initial: ContactState = { status: "idle" };

const fields = [
  { name: "name", label: "Nom", type: "text", autoComplete: "name" },
  { name: "company", label: "Entreprise", type: "text", autoComplete: "organization" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
] as const;

export function Contact({ email }: { email: string }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <section id="contact" className={s.contact} aria-labelledby="contact-title">
      <h2 id="contact-title" className={s.title}>
        Prenez
        <br />
        le départ
        <br />
        avec nous
      </h2>

      {state.status === "success" ? (
        <p className={s.success} role="status">
          Message reçu. On vous répond sous 48 heures.
        </p>
      ) : (
        <form action={action} className={s.form} noValidate>
          {fields.map((f) => (
            <label key={f.name} className={s.field}>
              <span className="mono">{f.label}</span>
              <input
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                required
                aria-invalid={!!errors[f.name]}
                className={s.input}
              />
              {errors[f.name] && <span className={s.error}>{errors[f.name]}</span>}
            </label>
          ))}
          <label className={`${s.field} ${s.full}`}>
            <span className="mono">Votre projet</span>
            <textarea name="message" rows={4} required aria-invalid={!!errors.message} className={s.input} />
            {errors.message && <span className={s.error}>{errors.message}</span>}
          </label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className={s.trap} aria-hidden />

          <div className={`${s.actions} ${s.full}`}>
            <button type="submit" className={s.submit} disabled={pending}>
              {pending ? "Envoi…" : "Envoyer"}
            </button>
            {state.status === "error" && (
              <p className={s.error} role="alert">
                {state.message}
              </p>
            )}
            <a href={`mailto:${email}`} className={`${s.mail} mono`}>
              {email}
            </a>
          </div>
        </form>
      )}
    </section>
  );
}
