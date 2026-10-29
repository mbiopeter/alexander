import Image from "next/image";
import { Activity, ArrowUpRight } from "lucide-react";

/**
 * Portfolio-only visual preview using the supplied dashboard reference.
 * Screenshot values are illustrative and never presented as live quotes.
 */
export function MbiotradePreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mbio-preview${compact ? " mbio-preview-compact" : ""}`}>
      <div className="mbio-preview-chrome">
        <span className="mbio-preview-traffic" aria-hidden="true"><i/><i/><i/></span>
        <span className="mbio-preview-url">traders.mbiopeter.co.ke</span>
        <span className="mbio-preview-label"><Activity size={12} aria-hidden="true" /> INTERFACE PREVIEW</span>
      </div>
      <div className="mbio-preview-screen">
        <Image
          src="/images/mbiotraders-dashboard.webp"
          alt="Illustrative mbioTraders dashboard with market selector, candle chart, animated-style strength gauge, signals, technical indicators and timeframe alignment"
          width={1536}
          height={942}
          sizes={compact ? "(max-width: 680px) 90vw, 540px" : "(max-width: 980px) 94vw, 820px"}
          priority={!compact}
        />
      </div>
      <div className="mbio-preview-bottom">
        <span>Design preview · sample market values, not live signals</span>
        <span className="mbio-preview-brand">mbio<span>Traders</span> <ArrowUpRight size={13} aria-hidden="true" /></span>
      </div>
    </div>
  );
}
