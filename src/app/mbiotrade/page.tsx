import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChartCandlestick,
  ChartNoAxesCombined,
  CheckCircle2,
  Cloud,
  Crosshair,
  Gauge,
  Layers3,
  LockKeyhole,
  MonitorSmartphone,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { MbiotradePreview } from "@/components/mbiotrade-preview";
import { MbiotradeTour } from "@/components/mbiotrade-tour";
import { MBIOTRADE_URL } from "@/lib/mbiotrade";
import { makeMetadata } from "@/lib/metadata";

const description = "Discover MbioTrade, an independent Deriv-connected trading workspace by Mbiopeter. Explore trend-first presets, position charts, risk management and optional background monitoring.";

export const metadata = makeMetadata("MbioTrade — Trend-first trading workspace", description, "/mbiotrade/");

const highlights = [
  { icon: TrendingUp, title: "Trade with the trend", description: "Trend alignment is built into strategy entry checks. A countertrend or incomplete setup is a reason to wait, not an invitation to force an order.", label: "01 / ENTRY" },
  { icon: ChartCandlestick, title: "A chart that explains the trade", description: "Long and short positions include visual entry, target and risk areas so you can see the plan in the context of market movement.", label: "02 / VISIBILITY" },
  { icon: RefreshCw, title: "Your trades across devices", description: "Reconnect the same Deriv account from another browser and restore eligible open positions and contract status from the broker.", label: "03 / CONTINUITY" },
  { icon: ShieldCheck, title: "Control SL and TP", description: "Review and adjust monetary stop-loss and take-profit settings on supported open multiplier contracts, subject to Deriv accepting the update.", label: "04 / PROTECTION" },
  { icon: Gauge, title: "Demo and real workflows", description: "Use the same application controls for both account types, with a demo environment available to practice before taking real risk.", label: "05 / PRACTICE" },
  { icon: Cloud, title: "Optional background worker", description: "An independently deployed, configured worker can continue analysis without an open browser. The website alone is not an always-on trading server.", label: "06 / AUTOMATION" },
];

const strategies = [
  { market: "EUR / USD", symbol: "EU", label: "EMA Pullback", timeframe: "1H", detail: "Price returns toward a fast moving average, then confirms continuation in the broader trend.", phase: "Trend → Pullback → Resume" },
  { market: "GBP / USD", symbol: "GU", label: "Breakout Retest", timeframe: "1H", detail: "Look for a confirmed break through a range and a retest before entering in the same direction.", phase: "Range → Break → Retest" },
  { market: "USD / JPY", symbol: "UJ", label: "Momentum Restart", timeframe: "1H", detail: "Watch for momentum to cool during a pullback and return in line with the established trend.", phase: "Trend → Reset → Momentum" },
  { market: "AUD / USD", symbol: "AU", label: "Channel Continuation", timeframe: "4H", detail: "Requires a completed close beyond the earlier channel, together with broader trend agreement.", phase: "Channel → Break → Confirm" },
  { market: "XAU / USD", symbol: "XAU", label: "Gold Pullback Rejection", timeframe: "1H", detail: "Wait for Gold to pull back into a moving-average zone and show a confirming rejection candle.", phase: "Trend → Zone → Rejection", featured: true },
  { market: "ANY MARKET", symbol: "ALL", label: "Trend Pullback", timeframe: "1H", detail: "The general principle: identify the trend, let price retrace, then require confirmation before entry.", phase: "Direction → Wait → Enter" },
];

const steps = [
  { number: "01", icon: WalletCards, title: "Connect the account", detail: "Sign in through the trading application using Deriv account credentials. The portfolio landing page never asks for API tokens." },
  { number: "02", icon: ScanLine, title: "Choose the setup", detail: "Pick a market, review a preset and decide between signal-only, manual or automatic order execution." },
  { number: "03", icon: Crosshair, title: "Review and manage", detail: "Check the chart drawing, open-contract details and risk limits as your position changes." },
];

const questions = [
  { q: "Does this page connect to my Deriv account?", a: "No. This is a portfolio showcase. Use the Launch MbioTrade button to open the separate trading application, where account connection and trading controls live." },
  { q: "Can I open trades on one device and monitor them on another?", a: "The trading platform reconnects to eligible open positions using the connected Deriv account. Use the same account on both devices. Broker data, not this portfolio or another browser's local storage, supplies the contract state." },
  { q: "Can I edit stop loss and take profit after entering?", a: "For supported open multiplier contracts, MbioTrade can request changes to monetary stop-loss and take-profit limits. Deriv must accept the update, and some contract types or conditions may restrict changes." },
  { q: "Will automatic analysis run when I close my browser?", a: "Only when an independent worker has been deployed, supplied with current strategy settings and credentials, and is actually running. Normal serverless website hosting alone does not keep a browser analysis loop alive." },
  { q: "Are these strategies guaranteed to make money?", a: "No. Strategy descriptions explain entry rules, not verified profitability for your account. Markets change, leverage increases risk, and test results cannot guarantee future performance. Start with a demo account and set your own risk limits." },
];

export default function MbiotradeLandingPage() {
  return (
    <main id="main" className="page-main mbio-page">
      <nav className="shell mbio-breadcrumb" aria-label="Breadcrumb">
        <Link href="/public-projects/"><ArrowLeft size={14} aria-hidden="true" /> Public Projects</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">MbioTrade</span>
      </nav>

      <section className="shell mbio-hero" aria-labelledby="mbio-title">
        <div className="mbio-hero-orbit" aria-hidden="true" />
        <div className="mbio-hero-copy">
          <span className="mbio-kicker"><span className="mbio-pulse" /> A PUBLIC PROJECT BY MBIOPETER</span>
          <h1 id="mbio-title">Read the trend.<br /><span>Own the trade.</span></h1>
          <p>Meet MbioTrade — a thoughtfully designed, Deriv-connected trading workspace that brings charts, trend-first strategies, risk controls and position management into one place.</p>
          <div className="mbio-hero-actions">
            <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="button button-accent">
              Launch MbioTrade <ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href="#mbio-tour" className="mbio-hero-quiet">Explore the platform <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <div className="mbio-hero-chips" aria-label="Platform highlights"><span>DERIV CONNECTED</span><span>DEMO + REAL</span><span>TREND-FIRST PRESETS</span></div>
          <div className="mbio-hero-note"><LockKeyhole size={15} aria-hidden="true" /> This is the project showcase. Your Deriv connection and trades happen only in the separate MbioTrade app.</div>
        </div>
        <div className="mbio-hero-visual"><MbiotradePreview /></div>
      </section>

      <section className="shell mbio-facts" aria-label="Platform at a glance">
        <div><strong>06<span className="mbio-facts-accent">.</span></strong><span>Trend-focused presets</span></div>
        <div><strong>05<span className="mbio-facts-accent">.</span></strong><span>Market-specific setups</span></div>
        <div><strong>02<span className="mbio-facts-accent">.</span></strong><span>Account environments</span></div>
      </section>

      <div className="shell mbio-page-links" aria-label="Jump to a section">
        <a href="#mbio-tour">Workspace <ArrowRight size={14} aria-hidden="true" /></a>
        <a href="#mbio-features">Features <ArrowRight size={14} aria-hidden="true" /></a>
        <a href="#mbio-strategies">Strategies <ArrowRight size={14} aria-hidden="true" /></a>
        <a href="#mbio-workflow">How it works <ArrowRight size={14} aria-hidden="true" /></a>
        <a href="#mbio-faq">Questions <ArrowRight size={14} aria-hidden="true" /></a>
      </div>

      <MbiotradeTour />

      <section id="mbio-features" className="shell page-section mbio-section" aria-labelledby="mbio-features-title">
        <div className="mbio-section-head">
          <p className="eyebrow">THE DETAILS MAKE THE DIFFERENCE</p>
          <h2 id="mbio-features-title">Built for a more <span className="muted-heading">focused way to trade.</span></h2>
          <p>Useful tools should make important information easy to find. MbioTrade connects the decision before entry with the information you need afterward.</p>
        </div>
        <div className="mbio-feature-grid">
          {highlights.map(({ icon: Icon, title, description: text, label }) => (
            <article key={title} className="mbio-info-card">
              <div className="mbio-info-card-top"><span className="mbio-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span><span>{label}</span></div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mbio-strategies-section" id="mbio-strategies" aria-labelledby="mbio-strategies-title">
        <div className="shell page-section">
          <div className="mbio-section-head mbio-section-head-wide">
            <div><p className="eyebrow">A PLAYBOOK FOR EACH MARKET</p><h2 id="mbio-strategies-title">Six approaches.<br /><span className="muted-heading">One guiding principle.</span></h2></div>
            <p>Five presets designed for individual markets, plus a general trend-pullback setup. Each starts with the market direction — the entry must agree with the confirmed trend.</p>
          </div>
          <div className="mbio-strategy-grid">
            {strategies.map((strategy, index) => (
              <article key={strategy.market} className={`mbio-strategy-card${strategy.featured ? " mbio-strategy-featured" : ""}`}>
                <div className="mbio-strategy-top"><span>{strategy.market}</span><span>{String(index + 1).padStart(2, "0")}/06</span></div>
                <div className="mbio-strategy-symbol-row"><span className="mbio-strategy-symbol">{strategy.symbol}</span><span className="mbio-strategy-timeframe">{strategy.timeframe} STARTING CHART</span></div>
                <h3>{strategy.label}</h3><p>{strategy.detail}</p>
                <div className="mbio-strategy-phase"><ChartNoAxesCombined size={15} aria-hidden="true" /> {strategy.phase}</div>
                <div className="mbio-strategy-rule"><CheckCircle2 size={14} aria-hidden="true" /> Confirmed trend required</div>
              </article>
            ))}
          </div>
          <p className="mbio-strategy-disclaimer">These are transparent starting configurations, not a claim that any strategy or timeframe is proven profitable. Validate on demo and review your own results.</p>
        </div>
      </section>

      <section className="shell page-section mbio-continuity" aria-labelledby="mbio-continuity-title">
        <div className="mbio-continuity-intro">
          <p className="eyebrow">ONE ACCOUNT / A CONNECTED EXPERIENCE</p>
          <h2 id="mbio-continuity-title">Your browser changes.<br /><span className="muted-heading">Your broker account doesn't.</span></h2>
          <p>A position opened in one place should not disappear from your workspace when you switch screens. MbioTrade retrieves supported open contracts from Deriv after you connect the same account on another device.</p>
          <div className="mbio-continuity-points">
            <div><RefreshCw size={18} aria-hidden="true" /><span><strong>Broker-sourced positions</strong><small>Open contract state is reconciled from Deriv.</small></span></div>
            <div><ChartCandlestick size={18} aria-hidden="true" /><span><strong>Restored chart drawings</strong><small>See available entry, target and stop details again.</small></span></div>
            <div><SlidersHorizontal size={18} aria-hidden="true" /><span><strong>Manage from your active device</strong><small>Close or request supported protection changes.</small></span></div>
          </div>
        </div>
        <div className="mbio-continuity-art" aria-label="Diagram of multiple devices connected to a single Deriv account">
          <div className="mbio-continuity-node mbio-node-main"><Layers3 size={29} aria-hidden="true" /><div><small>SOURCE OF TRUTH</small><strong>Deriv account</strong><span>Open contracts &amp; broker status</span></div></div>
          <div className="mbio-continuity-track" aria-hidden="true"><span/><span/></div>
          <div className="mbio-continuity-devices">
            <div><MonitorSmartphone size={25} aria-hidden="true" /><strong>Device one</strong><span>Trade opened</span></div>
            <div><RefreshCw size={25} aria-hidden="true" /><strong>Device two</strong><span>Position restored</span></div>
          </div>
          <p><CheckCircle2 size={14} aria-hidden="true" /> Same Deriv account required on both devices</p>
        </div>
      </section>

      <section className="mbio-worker-section" aria-labelledby="mbio-worker-title">
        <div className="shell mbio-worker-inner">
          <div className="mbio-worker-visual" aria-hidden="true">
            <div className="mbio-worker-visual-header"><span><span className="mbio-worker-status-dot"/> WORKER / ILLUSTRATION</span><Cloud size={18} /></div>
            <div className="mbio-worker-visual-body">
              <div><span className="mbio-worker-line-number">01</span><span>market.connect()</span><span className="mbio-worker-line-good">connected*</span></div>
              <div><span className="mbio-worker-line-number">02</span><span>strategy.waitForCandle()</span><span className="mbio-worker-line-good">monitoring*</span></div>
              <div><span className="mbio-worker-line-number">03</span><span>risk.validate()</span><span className="mbio-worker-line-muted">before entry</span></div>
              <div><span className="mbio-worker-line-number">04</span><span>account.reconcile()</span><span className="mbio-worker-line-muted">broker state</span></div>
            </div>
            <div className="mbio-worker-visual-footer"><Activity size={16} aria-hidden="true" /> Example workflow, not a live worker status</div>
          </div>
          <div className="mbio-worker-copy"><p className="eyebrow">ANALYSIS THAT DOESN'T NEED A TAB OPEN</p><h2 id="mbio-worker-title">Keep an eye on the setup. <span>Even when you're away.</span></h2><p>MbioTrade includes an optional separately deployed background worker for continuing analysis on a configured market after the browser closes. It can operate in signal-only or automatic mode, depending on how it is set up.</p><div className="mbio-worker-caveat"><Bot size={21} aria-hidden="true" /><span>Background operation requires a running worker, current settings and broker credentials. It is not enabled just by deploying or closing the website, and hosting uptime is not guaranteed.</span></div></div>
        </div>
      </section>

      <section className="shell page-section mbio-section" id="mbio-workflow" aria-labelledby="mbio-workflow-title">
        <div className="mbio-section-head">
          <p className="eyebrow">FROM IDEA TO EXECUTION</p>
          <h2 id="mbio-workflow-title">Start simple.<br /><span className="muted-heading">Keep every step visible.</span></h2>
          <p>Three steps to explore the workspace, with the flexibility to practise on demo before deciding whether real-account trading is appropriate.</p>
        </div>
        <div className="mbio-workflow-grid">
          {steps.map(({ number, icon: Icon, title, detail }) => (
            <article key={number} className="mbio-workflow-step">
              <div className="mbio-workflow-top"><span>{number}</span><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></div>
              <h3>{title}</h3><p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mbio-faq" className="mbio-faq-section" aria-labelledby="mbio-faq-title">
        <div className="shell mbio-faq-layout">
          <div className="mbio-faq-intro"><p className="eyebrow">GOOD TO KNOW / BEFORE YOU OPEN THE APP</p><h2 id="mbio-faq-title">The practical <span className="muted-heading">questions.</span></h2><p>What happens on the portfolio, what happens on Deriv, and what needs to be running in the background.</p><a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="mbio-faq-link">Explore MbioTrade <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div>
          <div className="mbio-faq-list">
            {questions.map(({ q, a }, index) => (
              <details key={q} className="mbio-faq-item"><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{q}</strong><span className="mbio-faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="shell mbio-care-panel" aria-labelledby="mbio-care-title">
        <div className="mbio-care-mark"><Layers3 size={26} aria-hidden="true" /></div>
        <div><p className="eyebrow">BUILT FOR CLARITY, NOT PROMISES</p><h2 id="mbio-care-title">Better tools. Your decisions.</h2><p>Trading involves real risk, including losing your stake. No strategy has guaranteed results. Explore with a demo account first, understand Deriv's supported instruments and contract rules, and choose risk limits you can afford. This project is a trading tool, not investment advice.</p></div>
        <Activity size={84} className="mbio-care-art" strokeWidth={1} aria-hidden="true" />
      </section>

      <section className="shell mbio-final-wrap" aria-labelledby="mbio-final-title">
        <div className="mbio-final-cta">
          <div><span className="mbio-final-eyebrow"><Bot size={16} aria-hidden="true" /> AN INDEPENDENT BUILD BY MBIOPETER</span><h2 id="mbio-final-title">See the full MbioTrade experience.</h2><p>Open the real platform to explore the workspace, strategies, charts and account settings.</p></div>
          <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="button button-accent">Launch MbioTrade <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        <div className="mbio-final-links"><Link href="/public-projects/"><ArrowLeft size={15} aria-hidden="true" /> All public projects</Link><span>Illustrations are not live prices, trading signals or investment advice.</span></div>
      </section>
    </main>
  );
}
