"use client";

import { useState } from "react";
import { Activity, ArrowUpRight, ChartCandlestick, ShieldCheck } from "lucide-react";

type Market = "gold" | "eurusd";

const candles: [number, number, number, number][] = [
  [212, 223, 190, 204], [204, 218, 183, 191], [192, 201, 166, 175],
  [174, 201, 167, 196], [197, 219, 181, 205], [205, 212, 178, 188],
  [187, 199, 161, 171], [171, 184, 144, 157], [157, 176, 149, 168],
  [169, 194, 155, 185], [185, 200, 167, 174], [174, 185, 145, 158],
  [157, 175, 136, 146], [147, 165, 128, 155], [156, 172, 139, 165],
  [166, 178, 143, 151], [150, 164, 127, 137], [138, 153, 119, 126],
  [126, 151, 113, 141], [142, 162, 126, 156], [157, 172, 139, 147],
  [148, 165, 133, 139], [140, 155, 122, 129], [130, 146, 108, 118],
  [118, 137, 101, 127], [127, 143, 110, 120], [120, 136, 102, 113],
];

const markets: Record<Market, { label: string; full: string; note: string }> = {
  gold: { label: "XAU/USD", full: "Gold · US Dollar", note: "Gold pullback setup" },
  eurusd: { label: "EUR/USD", full: "Euro · US Dollar", note: "EMA continuation setup" },
};

/** An illustrative, non-connected preview. Do not render broker prices or account data here. */
export function MbiotradePreview({ compact = false }: { compact?: boolean }) {
  const [market, setMarket] = useState<Market>("gold");
  const current = markets[market];

  return (
    <div className={`mbio-terminal ${compact ? "mbio-terminal-compact" : ""}`}>
      <div className="mbio-terminal-top">
        <div className="mbio-terminal-brand">
          <span className="mbio-terminal-logo" aria-hidden="true"><ChartCandlestick size={15} /></span>
          <span>mbio<span className="mbio-terminal-brand-accent">Trade</span></span>
          <span className="mbio-terminal-divider" aria-hidden="true" />
          <span className="mbio-terminal-muted">TERMINAL</span>
        </div>
        <span className="mbio-terminal-status"><span /> DEMO VISUAL</span>
      </div>
      <div className="mbio-terminal-body">
        <div className="mbio-terminal-chart-top">
          <div className="mbio-terminal-tabs" role="group" aria-label="Select example market">
            {(["gold", "eurusd"] as const).map((key) => (
              <button
                key={key}
                type="button"
                className={market === key ? "mbio-market-active" : ""}
                aria-pressed={market === key}
                onClick={() => setMarket(key)}
              >
                {markets[key].label}
              </button>
            ))}
          </div>
          <span className="mbio-terminal-timeframe"><Activity size={12} aria-hidden="true"/> H1</span>
        </div>
        <div className="mbio-chart-head">
          <div>
            <strong>{current.full}</strong>
            <span>{current.note}</span>
          </div>
          <div className="mbio-chart-direction">TREND · UP <ArrowUpRight size={14} aria-hidden="true" /></div>
        </div>
        <svg
          className="mbio-chart-svg"
          viewBox="0 0 580 280"
          role="img"
          aria-label={`Illustrative ${current.label} candlestick chart showing a long position with a take-profit area above entry and stop-loss area below entry. Not live prices.`}
        >
          <defs>
            <linearGradient id="mbio-profit-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#55e7ad" stopOpacity=".23"/>
              <stop offset="100%" stopColor="#55e7ad" stopOpacity=".06"/>
            </linearGradient>
            <linearGradient id="mbio-loss-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8080" stopOpacity=".07"/>
              <stop offset="100%" stopColor="#ff8080" stopOpacity=".22"/>
            </linearGradient>
          </defs>
          {[48, 95, 142, 189, 236].map((y) => (
            <line key={`h${y}`} x1="0" x2="580" y1={y} y2={y} stroke="#91aa9b" opacity=".14" strokeWidth="1" />
          ))}
          {[55, 135, 215, 295, 375, 455, 535].map((x) => (
            <line key={`v${x}`} x1={x} x2={x} y1="12" y2="258" stroke="#91aa9b" opacity=".08" strokeWidth="1" />
          ))}
          {/* The position artwork is deliberately labelled as illustrative; it does not represent execution. */}
          <rect x="299" y="47" width="257" height="103" rx="4" fill="url(#mbio-profit-fill)" stroke="#55e7ad" strokeOpacity=".32" />
          <rect x="299" y="150" width="257" height="76" rx="4" fill="url(#mbio-loss-fill)" stroke="#ff8080" strokeOpacity=".3" />
          <line x1="292" y1="47" x2="568" y2="47" stroke="#74f6bb" strokeWidth="1.3" strokeDasharray="5 4" />
          <line x1="292" y1="150" x2="568" y2="150" stroke="#d8e5d8" strokeWidth="1.2" strokeDasharray="5 4" />
          <line x1="292" y1="226" x2="568" y2="226" stroke="#ffa1a1" strokeWidth="1.3" strokeDasharray="5 4" />
          {candles.map(([open, high, low, close], i) => {
            const x = 18 + i * 14;
            const up = close < open;
            return (
              <g key={i}>
                <line x1={x + 3.5} x2={x + 3.5} y1={high} y2={low} stroke={up ? "#67e7b4" : "#f2a69d"} strokeWidth="1.4" />
                <rect x={x} y={Math.min(open, close)} width="7" height={Math.max(2, Math.abs(open - close))} rx=".6" fill={up ? "#67e7b4" : "#f2a69d"} />
              </g>
            );
          })}
          <g fontFamily="system-ui, sans-serif" fontWeight="650" fontSize="11">
            <rect x="440" y="34" width="110" height="24" rx="5" fill="#1b5944" />
            <text x="495" y="50" fill="#a9f8d4" textAnchor="middle">TAKE PROFIT</text>
            <rect x="452" y="137" width="98" height="24" rx="5" fill="#33433d" />
            <text x="501" y="153" fill="#f4fff4" textAnchor="middle">LONG ENTRY</text>
            <rect x="452" y="213" width="98" height="24" rx="5" fill="#693c40" />
            <text x="501" y="229" fill="#ffd3d3" textAnchor="middle">STOP LOSS</text>
          </g>
          <g fill="#96a69f" fontFamily="system-ui, sans-serif" fontSize="10">
            <text x="18" y="268">09:00</text><text x="154" y="268">11:00</text><text x="290" y="268">13:00</text><text x="426" y="268">15:00</text>
          </g>
        </svg>
        <div className="mbio-terminal-bottom">
          <div className="mbio-terminal-detail"><ShieldCheck size={14} /> <span>Risk and target visualized</span></div>
          <span>ILLUSTRATION · NO LIVE DATA</span>
        </div>
      </div>
    </div>
  );
}
