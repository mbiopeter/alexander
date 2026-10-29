import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  ChartCandlestick,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  Gauge,
  Globe2,
  Layers3,
  LockKeyhole,
  MoveUpRight,
  Radar,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { MbiotradePreview } from "@/components/mbiotrade-preview";
import { MbiotradeTour } from "@/components/mbiotrade-tour";
import { MBIOTRADE_URL } from "@/lib/mbiotrade";
import { makeMetadata } from "@/lib/metadata";

const description = "Explore mbioTraders by Mbiopeter: a real-time market signal dashboard for Gold and major forex pairs, with technical-strength gauges, 3–7 day trend momentum, six timeframes and audible setup alerts. Signals only; no trade execution.";

const baseMetadata = makeMetadata("mbioTraders — Live Gold & Forex Signal Dashboard", description, "/mbiotrade/");
export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [{ url: "/social/mbiotraders.png", width: 1200, height: 630, alt: "mbioTraders market signals dashboard by Mbiopeter" }],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: ["/social/mbiotraders.png"],
  },
};

const highlights = [
  { icon: ChartCandlestick, tag: "LIVE MARKETS", title: "One clear market canvas", description: "Read price action, moving averages, current quote and nearby market levels without jumping between screens." },
  { icon: Gauge, tag: "TECHNICAL CONSENSUS", title: "Strength that moves", description: "The animated gauge summarizes technical indicator votes. It is a strength measure—not a guaranteed win rate." },
  { icon: Layers3, tag: "TOP-DOWN CONTEXT", title: "Let the larger trend lead", description: "Compare six chart timeframes and inspect higher-timeframe momentum over 3, 5 or 7 completed trading days." },
  { icon: BellRing, tag: "SETUP ALERTS", title: "Hear it when conditions line up", description: "Optional sound notifications identify newly confirmed setups in the direction of the larger trend while the page is open." },
  { icon: Radar, tag: "SIGNAL EXPLANATION", title: "A reason behind every reading", description: "BUY, SELL or WAIT is accompanied by entry conditions, a confluence score and indicative risk and target levels." },
  { icon: RefreshCw, tag: "DATA AWARENESS", title: "Know when data is unavailable", description: "Market data can reconnect after interruptions; old, incomplete or missing information should not be mistaken for a fresh setup." },
];

const markets = [
  { pair: "XAU/USD", note: "Gold", tag: "METALS" },
  { pair: "EUR/USD", note: "Euro / Dollar", tag: "FOREX" },
  { pair: "GBP/USD", note: "Pound / Dollar", tag: "FOREX" },
  { pair: "USD/JPY", note: "Dollar / Yen", tag: "FOREX" },
  { pair: "AUD/USD", note: "Aussie / Dollar", tag: "FOREX" },
  { pair: "USD/CAD", note: "Dollar / Loonie", tag: "FOREX" },
];

const steps = [
  { number: "01", icon: Globe2, title: "Choose your market", detail: "Switch between Gold and five major forex pairs. Select the chart timeframe you want to inspect." },
  { number: "02", icon: TrendingUp, title: "Check the bigger picture", detail: "Read 1H, 4H and daily momentum across a chosen 3-, 5- or 7-day window, then compare the shorter timeframes." },
  { number: "03", icon: ShieldCheck, title: "Wait for confirmation", detail: "Watch for a pullback reversing toward the higher-timeframe trend. Inspect the checklist, proposed levels and market-data status before acting independently." },
];

const questions = [
  { q: "Is mbioTraders a trading platform?", a: "No. mbioTraders is a signal and market-research dashboard. It does not place trades, manage a broker account, request trading credentials or guarantee outcomes." },
  { q: "Which instruments and timeframes are available?", a: "The interface covers Gold (XAU/USD) and EUR/USD, GBP/USD, USD/JPY, AUD/USD and USD/CAD. You can switch between 5m, 15m, 30m, 1H, 4H and daily charts, subject to actual market-data availability." },
  { q: "How does multi-timeframe confirmation work?", a: "The strategy checks the broader direction on 1H, 4H and daily candles using completed market history, with selectable 3-, 5- and 7-trading-day lookbacks. The smaller timeframe must then confirm a pullback reversal in that direction." },
  { q: "What does the confidence percentage represent?", a: "It is a rule-based confluence score summarizing which checks agree. It is not a statistical probability of profit, and the historical screen illustration contains example rather than audited results." },
  { q: "Are live alerts available if I close the browser?", a: "Audio alerts work while the mbioTraders page is running and the sound toggle is enabled. A browser or operating system can suspend a background tab; this portfolio does not host an always-running alert server." },
  { q: "Where do prices come from?", a: "The app supports provider-supplied candles through an optional Twelve Data configuration, otherwise a public Deriv feed. Data freshness and availability depend on the provider, and prices can differ between brokers." },
];

export default function MbiotradeLandingPage() {
  return (
    <main id="main" className="page-main mbio-page">
      <nav className="shell mbio-breadcrumb" aria-label="Breadcrumb">
        <Link href="/public-projects/"><ArrowLeft size={14} aria-hidden="true" /> Public Projects</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">mbioTraders</span>
      </nav>

      <section className="shell mbio-hero" aria-labelledby="mbio-title">
        <div className="mbio-hero-copy">
          <span className="mbio-kicker"><span className="mbio-pulse" /> MARKET INTELLIGENCE · BY MBIOPETER</span>
          <h1 id="mbio-title">Trade ideas begin with <span>market clarity.</span></h1>
          <p className="mbio-hero-description">Meet <strong>mbioTraders</strong> — a professional signal dashboard bringing Gold, major forex pairs, trend momentum, a live-moving strength gauge and confirmed market setups into one focused workspace.</p>
          <div className="mbio-hero-actions">
            <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="button mbio-button-primary">Launch mbioTraders <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a href="#mbio-tour" className="mbio-button-secondary">Explore the dashboard <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <div className="mbio-hero-chips"><span><CheckCircle2 size={13} aria-hidden="true" /> SIGNALS ONLY</span><span><ChartNoAxesCombined size={13} aria-hidden="true" /> PUBLIC MARKET FEEDS</span><span><Layers3 size={13} aria-hidden="true" /> SIX TIMEFRAMES</span></div>
          <p className="mbio-hero-note"><LockKeyhole size={15} aria-hidden="true" /> No trading login or broker order permissions are required to explore the signals.</p>
        </div>
        <div className="mbio-hero-visual">
          <MbiotradePreview />
          <span className="mbio-hero-visual-caption"><Activity size={13} aria-hidden="true" /> Dashboard UI preview · Illustrative readings</span>
        </div>
      </section>

      <section className="shell mbio-facts" aria-label="mbioTraders at a glance">
        <div><strong>06<span className="mbio-facts-accent">.</span></strong><span>Markets to explore</span></div>
        <div><strong>06<span className="mbio-facts-accent">.</span></strong><span>Chart timeframes</span></div>
        <div><strong>03<span className="mbio-facts-accent">.</span></strong><span>Momentum lookbacks</span></div>
        <div><strong>00<span className="mbio-facts-accent">.</span></strong><span>Broker orders placed</span></div>
      </section>

      <nav className="shell mbio-page-links" aria-label="Page sections">
        <a href="#mbio-tour">Inside the app <ArrowRight size={14} /></a>
        <a href="#mbio-features">Features <ArrowRight size={14} /></a>
        <a href="#mbio-markets">Markets <ArrowRight size={14} /></a>
        <a href="#mbio-workflow">How it works <ArrowRight size={14} /></a>
        <a href="#mbio-faq">FAQs <ArrowRight size={14} /></a>
      </nav>

      <MbiotradeTour />

      <section id="mbio-features" className="shell mbio-section-inner" aria-labelledby="mbio-features-title">
        <div className="mbio-section-heading">
          <p className="eyebrow">DESIGNED FOR BETTER DECISIONS</p>
          <h2 id="mbio-features-title">Less switching. <span className="muted-heading">More context.</span></h2>
          <p>Charts, strength, trend alignment and signal conditions work together to answer one question: is this setup ready, or should you wait?</p>
        </div>
        <div className="mbio-feature-grid">
          {highlights.map(({ icon: Icon, title, description, tag }) => (
            <article key={title} className="mbio-info-card">
              <div className="mbio-info-card-top"><span className="mbio-icon"><Icon size={20} aria-hidden="true" strokeWidth={1.8} /></span><small>{tag}</small></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mbio-markets" className="mbio-markets-section" aria-labelledby="mbio-markets-title">
        <div className="shell mbio-section-inner">
          <div className="mbio-section-heading mbio-section-heading-row">
            <div><p className="eyebrow">GOLD + MAJOR FX</p><h2 id="mbio-markets-title">Your watchlist. <span className="muted-heading">One interface.</span></h2></div>
            <p>Change instruments or chart timeframes without leaving the dashboard. Each view uses actual provider data when available.</p>
          </div>
          <div className="mbio-market-grid">
            {markets.map((item, index) => (
              <article key={item.pair} className={`mbio-market-card${index === 0 ? " mbio-market-gold" : ""}`}>
                <span className="mbio-market-icon" aria-hidden="true">{index === 0 ? "◆" : item.pair.slice(0, 1)}</span>
                <div><small>{item.tag}</small><strong>{item.pair}</strong><span>{item.note}</span></div>
                <MoveUpRight size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
          <div className="mbio-market-timeframes"><Clock3 size={17} aria-hidden="true" /><span>Choose a chart:</span><strong>5m</strong><strong>15m</strong><strong>30m</strong><strong>1H</strong><strong>4H</strong><strong>1D</strong></div>
        </div>
      </section>

      <section id="mbio-workflow" className="shell mbio-section-inner" aria-labelledby="mbio-workflow-title">
        <div className="mbio-section-heading"><p className="eyebrow">A MORE DISCIPLINED PROCESS</p><h2 id="mbio-workflow-title">From trend to setup. <span className="muted-heading">Three steps.</span></h2><p>Designed to help you read the market before making a decision elsewhere.</p></div>
        <div className="mbio-workflow-grid">
          {steps.map(({ number, icon: Icon, title, detail }) => (
            <article key={number} className="mbio-workflow-step"><div className="mbio-workflow-top"><span>{number}</span><Icon size={23} aria-hidden="true" /></div><h3>{title}</h3><p>{detail}</p></article>
          ))}
        </div>
      </section>

      <section className="shell mbio-care-panel" aria-labelledby="mbio-care-title">
        <div className="mbio-care-icon"><ShieldCheck size={27} aria-hidden="true" /></div>
        <div><p className="eyebrow">BUILT TO INFORM, NOT TO EXECUTE</p><h2 id="mbio-care-title">Clear signals. Independent decisions.</h2><p>mbioTraders provides research, not personalised financial advice. A signal score is not a success probability; market prices may differ by provider, and no method guarantees profitable trades. The dashboard does not send orders.</p></div>
        <Activity className="mbio-care-art" size={92} strokeWidth={1} aria-hidden="true" />
      </section>

      <section id="mbio-faq" className="mbio-faq-section" aria-labelledby="mbio-faq-title">
        <div className="shell mbio-faq-layout">
          <div className="mbio-faq-intro"><p className="eyebrow">GOOD TO KNOW</p><h2 id="mbio-faq-title">The practical <span className="muted-heading">questions.</span></h2><p>What the signals mean, when alerts work and how the live application differs from this portfolio showcase.</p><a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="mbio-inline-link">Open mbioTraders <ArrowUpRight size={16} /><span className="sr-only"> (opens in a new tab)</span></a></div>
          <div className="mbio-faq-list">
            {questions.map(({ q, a }, index) => <details key={q} className="mbio-faq-item"><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{q}</strong><span className="mbio-faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="shell mbio-final-wrap" aria-labelledby="mbio-final-title">
        <div className="mbio-final-cta">
          <div><span className="mbio-final-eyebrow"><Activity size={15} aria-hidden="true" /> MBIOPETER PUBLIC PROJECT</span><h2 id="mbio-final-title">See the bigger picture.<br/><span>Open mbioTraders.</span></h2><p>One dashboard. Six markets. Context before conviction.</p></div>
          <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="button mbio-button-primary">Explore live signals <ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </section>
    </main>
  );
}
