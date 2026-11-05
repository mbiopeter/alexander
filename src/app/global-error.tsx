"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Mbiopeter encountered a browser rendering error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", margin: 0, background: "#f8f9f5", color: "#17231b", fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center" }}>
        <main style={{ maxWidth: 460, padding: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 27, marginBottom: 12 }}>This page could not load.</h1>
          <p style={{ lineHeight: 1.6 }}>The browser had trouble rendering the website. Reloading may resolve a temporary issue.</p>
          <button
            type="button"
            onClick={() => { reset(); window.location.reload(); }}
            style={{ marginTop: 18, border: 0, borderRadius: 9, background: "#276749", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", padding: "12px 22px" }}>
            Reload website
          </button>
        </main>
      </body>
    </html>
  );
}
