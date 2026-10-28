"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChartCandlestick,
  Clock3,
  Cloud,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { MbiotradePreview } from "@/components/mbiotrade-preview";

const tour = [
  {
    id: "chart",
    number: "01",
    icon: ChartCandlestick,
    label: "Position chart",
    title: "Know where your trade stands.",
    description: "See the planned entry, stop-loss and take-profit areas together on the chart. Open contracts restored from Deriv can be shown in the same visual format.",
  },
  {
    id: "signals",
    number: "02",
    icon: TrendingUp,
    label: "Trend-first signals",
    title: "Trade a setup, not a guess.",
    description: "Presets use completed candles and require trend agreement before an entry is considered. When conditions aren't ready, the strategy waits.",
  },
  {
    id: "protection",
    number: "03",
    icon: ShieldCheck,
    label: "Risk controls",
    title: "Protection stays in focus.",
    description: "Review proposed order size, broker quote and balance checks. Edit supported monetary stop-loss and take-profit limits on an open multiplier position.",
  },
  {
    id: "sync",
    number: "04",
    icon: RefreshCw,
    label: "Cross-device sync",
    title: "Carry your positions with you.",
    description: "Connect the same Deriv account on another browser and recover its open positions directly from the broker, without depending on another device's local journal.",
  },
] as const;

type TourId = (typeof tour)[number]["id"];

function SignalsExample() {
  return (
    <div className="mbio-demo-panel mbio-demo-signals">
      <div className="mbio-demo-top"><span className="mbio-demo-tag"><Activity size={14} /> SIGNAL MONITOR</span><span>EXAMPLE ONLY</span></div>
      <div className="mbio-demo-market"><span className="mbio-demo-market-icon">Au</span><div><strong>XAU / USD</strong><small>Gold · H1 trend setup</small></div><span className="mbio-demo-chip">WATCHING</span></div>
      <div className="mbio-demo-focus"><span>Confirmed market direction</span><strong><TrendingUp size={18} /> UPWARD TREND</strong><p>Example state — not a live signal</p></div>
      <div className="mbio-demo-checklist">
        <div><CheckCircle2 size={17} /><span>Trend filter aligned</span><span className="mbio-demo-check">PASS</span></div>
        <div><CheckCircle2 size={17} /><span>Completed-candle history</span><span className="mbio-demo-check">PASS</span></div>
        <div className="mbio-demo-wait"><Clock3 size={17} /><span>Pullback confirmation</span><span className="mbio-demo-check">WAIT</span></div>
      </div>
      <div className="mbio-demo-footnote">No order is sent until the required setup and risk checks pass.</div>
    </div>
  );
}

function ProtectionExample() {
  return (
    <div className="mbio-demo-panel mbio-demo-protection">
      <div className="mbio-demo-top"><span className="mbio-demo-tag"><WalletCards size={14} /> TRADE MANAGEMENT</span><span>EXAMPLE ONLY</span></div>
      <div className="mbio-demo-contract"><div><small>Example open contract</small><strong>LONG · XAU/USD</strong></div><span className="mbio-demo-chip">OPEN</span></div>
      <div className="mbio-demo-protection-grid">
        <div className="mbio-demo-funding"><small>Selected stake</small><strong>$20.00</strong><span>For illustration</span></div>
        <div className="mbio-demo-funding"><small>Funding validation</small><strong><CheckCircle2 size={20} /> Before purchase</strong><span>Actual quote checked with Deriv</span></div>
      </div>
      <div className="mbio-demo-limits"><div><span className="mbio-demo-limit-dot mbio-demo-limit-stop"/><span>Stop loss</span><strong>Editable*</strong></div><div><span className="mbio-demo-limit-dot mbio-demo-limit-profit"/><span>Take profit</span><strong>Editable*</strong></div></div>
      <p className="mbio-demo-footnote">*For supported open contracts. Deriv must accept the requested changes; this panel is not a live order ticket.</p>
    </div>
  );
}

function SyncExample() {
  return (
    <div className="mbio-demo-panel mbio-demo-sync">
      <div className="mbio-demo-top"><span className="mbio-demo-tag"><Cloud size={14} /> ONE BROKER ACCOUNT</span><span>ILLUSTRATIVE FLOW</span></div>
      <div className="mbio-demo-sync-central"><span className="mbio-sync-orbit"><RefreshCw size={23} /></span><div><small>SOURCE OF TRUTH</small><strong>Deriv account</strong><span>Positions &amp; contract status</span></div></div>
      <div className="mbio-demo-sync-line" aria-hidden="true"><span /><span /></div>
      <div className="mbio-demo-device-grid">
        <div><Monitor size={24} /><strong>Desktop</strong><span>View positions</span><CheckCircle2 size={16} /></div>
        <div><Smartphone size={24} /><strong>Phone</strong><span>Same account</span><CheckCircle2 size={16} /></div>
      </div>
      <div className="mbio-demo-sync-bottom"><RefreshCw size={16} /> Open positions reload after connecting to the same Deriv account.</div>
    </div>
  );
}

export function MbiotradeTour() {
  const [active, setActive] = useState<TourId>("chart");
  const selected = tour.find((item) => item.id === active)!;
  return (
    <section className="mbio-tour-section" id="mbio-tour" aria-labelledby="mbio-tour-title">
      <div className="shell page-section">
        <div className="mbio-section-head mbio-tour-heading">
          <p className="eyebrow">A CLOSER LOOK / THE WORKSPACE</p>
          <h2 id="mbio-tour-title">Designed around <span className="muted-heading">the decisions that matter.</span></h2>
          <p>Explore the ideas behind the terminal, from making sense of a position to reconnecting on another device. Select a feature to see an illustrated walkthrough.</p>
        </div>
        <div className="mbio-tour-grid">
          <div className="mbio-tour-options" role="group" aria-label="Explore MbioTrade features">
            {tour.map(({ id, icon: Icon, number, label, title }) => (
              <button
                key={id}
                type="button"
                className={`mbio-tour-option${active === id ? " mbio-tour-option-active" : ""}`}
                aria-pressed={active === id}
                onClick={() => setActive(id)}>
                <span className="mbio-tour-option-number">{number}</span>
                <span className="mbio-tour-option-icon"><Icon size={20} aria-hidden="true" /></span>
                <span className="mbio-tour-option-text"><small>{label}</small><strong>{title}</strong></span>
                <ArrowRight size={17} className="mbio-tour-option-arrow" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="mbio-tour-stage" aria-live="polite" aria-atomic="true">
            {active === "chart" && <MbiotradePreview compact />}
            {active === "signals" && <SignalsExample />}
            {active === "protection" && <ProtectionExample />}
            {active === "sync" && <SyncExample />}
            <div className="mbio-tour-stage-caption"><span>{selected.number} / {selected.label}</span><p>{selected.description}</p></div>
          </div>
        </div>
        <p className="mbio-tour-illustration">All screens shown here are illustrative; no live market data, account balance or trade execution is connected to this portfolio page.</p>
      </div>
    </section>
  );
}
