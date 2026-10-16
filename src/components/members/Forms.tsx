"use client";

import { useActionState, type ReactNode } from "react";
import {
  contactPartner,
  login,
  requestPasswordReset,
  setPassword,
  updateProfile,
  type FormState,
} from "@/actions/members";
import s from "./members.module.css";

const idle: FormState = { status: "idle" };

function Form({
  action,
  submit,
  children,
  hideOnSuccess = false,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  submit: string;
  children: ReactNode;
  hideOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, idle);
  if (hideOnSuccess && state.status === "success") {
    return <p className={s.notice} role="status">{state.message}</p>;
  }
  return (
    <form action={formAction} className={s.form}>
      {children}
      <div className={s.actions}>
        <button type="submit" className={s.button} disabled={pending}>
          {pending ? "Un instant…" : submit}
        </button>
        {state.status !== "idle" && (
          <p className={state.status === "error" ? s.error : s.notice} role={state.status === "error" ? "alert" : "status"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ label, hint, ...input }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={s.field}>
      <span className="mono">{label}</span>
      <input className={s.input} {...input} />
      {hint && <span className={s.hint}>{hint}</span>}
    </label>
  );
}

function Area({ label, hint, ...area }: { label: string; hint?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={s.field}>
      <span className="mono">{label}</span>
      <textarea className={s.input} rows={4} {...area} />
      {hint && <span className={s.hint}>{hint}</span>}
    </label>
  );
}

export function LoginForm() {
  return (
    <Form action={login} submit="Se connecter">
      <Field label="E-mail" name="email" type="email" autoComplete="email" required />
      <Field label="Mot de passe" name="password" type="password" autoComplete="current-password" required />
    </Form>
  );
}

export function ResetRequestForm() {
  return (
    <Form action={requestPasswordReset} submit="Recevoir un lien" hideOnSuccess>
      <Field label="E-mail" name="email" type="email" autoComplete="email" required />
    </Form>
  );
}

export function SetPasswordForm({ token }: { token: string }) {
  return (
    <Form action={setPassword} submit="Enregistrer et entrer">
      <input type="hidden" name="token" value={token} />
      <Field label="Nouveau mot de passe" name="password" type="password" autoComplete="new-password" minLength={10} hint="10 caractères minimum." required />
      <Field label="Confirmation" name="confirm" type="password" autoComplete="new-password" required />
    </Form>
  );
}

export function ProfileForm({ name, jobTitle, offer, lookingFor, company }: {
  name: string;
  jobTitle: string;
  offer: string;
  lookingFor: string;
  company: string;
}) {
  return (
    <Form action={updateProfile} submit="Enregistrer">
      <Field label="Nom complet" name="name" defaultValue={name} autoComplete="name" required />
      <Field label="Fonction" name="jobTitle" defaultValue={jobTitle} autoComplete="organization-title" />
      <Area label={`${company} propose`} name="offer" defaultValue={offer} hint="Vos produits, services, ce que vous pouvez apporter aux autres partenaires." />
      <Area label={`${company} recherche`} name="lookingFor" defaultValue={lookingFor} hint="Fournisseurs, clients, compétences… ce qui vous serait utile." />
    </Form>
  );
}

export function ContactPartnerForm({ partnerId, partnerName }: { partnerId: number; partnerName: string }) {
  return (
    <Form action={contactPartner} submit="Envoyer" hideOnSuccess>
      <input type="hidden" name="partnerId" value={partnerId} />
      <Area label={`Votre message à ${partnerName}`} name="message" rows={3} required hint="Il recevra votre nom et votre e-mail pour vous répondre." />
    </Form>
  );
}
