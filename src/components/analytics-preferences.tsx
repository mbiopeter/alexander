"use client";

import { useEffect, useState } from "react";
import { analyticsOptedOut, getAnalyticsId, setAnalyticsOptOut } from "@/lib/analytics";

export function AnalyticsPreferences() {
  const [disabled, setDisabled] = useState<boolean | null>(null);
  const [status, setStatus] = useState("");
  useEffect(() => setDisabled(analyticsOptedOut()), []);
  if (!getAnalyticsId()) return <p>Analytics tracking is not currently configured for this environment.</p>;
  return (
    <div className="analytics-preferences" data-analytics-ignore="true">
      <p>Analytics on this browser: <strong>{disabled === null ? "Checking…" : disabled ? "Disabled" : "Enabled"}</strong></p>
      <button
        className="button button-outline"
        type="button"
        disabled={disabled === null}
        onClick={() => {
          if (disabled === null) return;
          const next = !disabled;
          if (!setAnalyticsOptOut(next)) {
            setStatus("This browser does not permit saving the preference. You can also block analytics cookies in browser settings.");
            return;
          }
          setDisabled(next);
          setStatus("Preference saved. Refresh this page to apply it to the Google Analytics script.");
        }}>
        {disabled ? "Enable analytics" : "Disable analytics"}
      </button>
      {status && <p role="status">{status}</p>}
    </div>
  );
}
