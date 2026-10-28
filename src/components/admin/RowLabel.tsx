"use client";

import { useRowLabel } from "@payloadcms/ui";

// Collapsed rows show what they hold, not "Avantage 01".

export function PerkRowLabel() {
  const { data, rowNumber = 0 } = useRowLabel<{ word?: string; stamp?: string }>();
  return <span>{data?.word ? `${data.word} · ${data.stamp ?? ""}` : `Avantage ${rowNumber + 1}`}</span>;
}

export function QuoteRowLabel() {
  const { data, rowNumber = 0 } = useRowLabel<{ author?: string; year?: number }>();
  return <span>{data?.author ? `${data.author}${data.year ? ` (${data.year})` : ""}` : `Citation ${rowNumber + 1}`}</span>;
}
