import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, Gauge, Layers3 } from "lucide-react";
import { MbiotradePreview } from "./mbiotrade-preview";
import { MBIOTRADE_URL } from "@/lib/mbiotrade";

export function MbiotradeFeature({ placement = "home" }: { placement?: "home" | "projects" }) {
  return (
    <article className={`mbio-feature mbio-feature-${placement}`} aria-labelledby={`mbio-feature-title-${placement}`}>
      <div className="mbio-feature-copy">
        <p className="eyebrow"><Activity size={15} aria-hidden="true" /> FEATURED BUILD / MARKET INTELLIGENCE</p>
        <h3 id={`mbio-feature-title-${placement}`}>Meet <span>mbioTraders.</span><br />Signals, without the noise.</h3>
        <p>An installable market dashboard for Gold, five forex pairs and BTC/USD. Check five aligned trend frames, confirmed 5-minute entries, news safeguards and live signal alerts—without placing a trade.</p>
        <div className="mbio-feature-tags" aria-label="Platform features">
          <span><Gauge size={15} aria-hidden="true" /> Signal-strength gauge</span>
          <span><Layers3 size={15} aria-hidden="true" /> Multi-timeframe alignment</span>
        </div>
        <div className="mbio-feature-actions">
          <Link href="/mbiotrade/" className="button button-primary" data-analytics-event="mbiotraders_explore" data-analytics-label="featured_explore">Explore mbioTraders <ArrowRight size={17} aria-hidden="true" /></Link>
          <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="text-link" data-analytics-event="mbiotraders_launch" data-analytics-label="featured_launch">Open live signals <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
      <div className="mbio-feature-visual"><MbiotradePreview compact /></div>
    </article>
  );
}
