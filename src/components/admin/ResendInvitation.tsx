"use client";

import { useState, useTransition } from "react";
import { Button, useDocumentInfo } from "@payloadcms/ui";
import { resendInvitation, type FormState } from "@/actions/members";

/** Sidebar button on a member: e-mails a new link to choose a password (lost invitation, expired link). */
export function ResendInvitation() {
  const { id } = useDocumentInfo();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [pending, start] = useTransition();
  if (!id) return null;

  return (
    <div style={{ marginBottom: "var(--base)" }}>
      <Button
        buttonStyle="secondary"
        size="small"
        disabled={pending}
        onClick={() => start(async () => setState(await resendInvitation(Number(id))))}
      >
        {pending ? "Envoi…" : "Renvoyer l'invitation"}
      </Button>
      {state.status !== "idle" && (
        <p style={{ margin: 0, color: state.status === "error" ? "var(--theme-error-500)" : "var(--theme-success-500)" }}>{state.message}</p>
      )}
    </div>
  );
}
