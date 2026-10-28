import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChartCandlestick, ShieldCheck } from "lucide-react";
import { MbiotradePreview } from "./mbiotrade-preview";
import { MBIOTRADE_URL } from "@/lib/mbiotrade";

export function MbiotradeFeature({ placement = "home" }: { placement?: "home" | "projects" }) {
  return (
    <article className={`mbio-feature mbio-feature-${placement}`} aria-labelledby={`mbio-feature-title-${placement}`}>
      <div className="mbio-feature-copy">
        <div className="eyebrow"><span aria-hidden="true">✳</span> FEATURED BUILD / TRADING TECHNOLOGY</div>
        <h3 id={`mbio-feature-title-${placement}`}>Meet <span>mbioTrade.</span><br />A clearer trading workspace.</h3>
        <p>One place for trend-based strategies, chart positions, trade protection, and Deriv account synchronization. Built to make every trading decision easier to review.</p>
        <div className="mbio-feature-tags" aria-label="Platform highlights">
          <span><ChartCandlestick size={14} aria-hidden="true" /> Strategy-led charts</span>
          <span><ShieldCheck size={14} aria-hidden="true" /> SL / TP controls</span>
        </div>
        <div className="mbio-feature-actions">
          <Link href="/mbiotrade/" className="button button-primary">Explore MbioTrade <ArrowRight size={17} aria-hidden="true" /></Link>
          <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="text-link">
            Open platform <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
      <div className="mbio-feature-visual"><MbiotradePreview compact /></div>
    </article>
  );
}
