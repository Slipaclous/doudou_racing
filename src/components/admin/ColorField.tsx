"use client";
import type { TextFieldClientComponent } from "payload";
import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui";

/** Color picker + hex input for the theme colors (Réglages du site → Couleurs). */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path });
  const hex = /^#[0-9a-f]{6}$/i.test(value ?? "") ? value : "#000000";

  return (
    <div className="field-type text doudou-color">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <FieldError path={path} showError={showError} />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={hex}
          onChange={(e) => setValue(e.target.value)}
          aria-label={typeof field.label === "string" ? field.label : "Couleur"}
          style={{ width: 48, height: 40, padding: 0, border: "1px solid var(--theme-elevation-150)", cursor: "pointer" }}
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#e10600"
          maxLength={7}
          style={{ width: 110, fontFamily: "monospace" }}
        />
      </div>
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  );
};
