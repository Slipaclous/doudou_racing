"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";

const noSubscribe = () => () => {};

/** Inside the back-office live preview only: reloads the page's content when the editor saves. */
export function LivePreview() {
  const router = useRouter();
  // Framed = shown in the admin's preview pane; false on the server and for visitors.
  const framed = useSyncExternalStore(noSubscribe, () => window.self !== window.top, () => false);
  if (!framed) return null;
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={window.location.origin} />;
}
