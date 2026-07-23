"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Catches errors thrown by the root layout itself, which error.tsx can't
// reach (it only covers the tree below the layout). Sentry's docs call for
// this file specifically for that gap. Kept deliberately bare — inline
// styles only, since the root layout (and its Tailwind globals) may be
// exactly what failed to render.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: "Arial, sans-serif", padding: "48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: "8px", color: "#555" }}>
          Please refresh the page. If this keeps happening, contact
          nephi.asha@deseretfacilities.com.
        </p>
      </body>
    </html>
  );
}
