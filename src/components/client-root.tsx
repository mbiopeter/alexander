"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";
import { ANALYTICS_OPT_OUT_KEY } from "@/lib/analytics";
import { initializeSiteBrowser } from "@/lib/browser-boot";

type ClientRootProps = {
  children: ReactNode;
  analyticsId: string | null;
  structuredProfile: Record<string, unknown> | null;
};

export function ClientRoot({ children, analyticsId, structuredProfile }: ClientRootProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeSiteBrowser({
      analyticsId,
      analyticsOptOutKey: ANALYTICS_OPT_OUT_KEY,
      structuredProfile,
    });
    setReady(true);
  }, [analyticsId, structuredProfile]);

  return (
    <Providers>
      {analyticsId && ready && <AnalyticsTracker />}
      <SiteShell>{children}</SiteShell>
    </Providers>
  );
}

export default ClientRoot;
