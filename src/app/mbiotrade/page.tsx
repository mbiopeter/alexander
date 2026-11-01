import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Bitcoin,
  Download,
  History,
  MonitorSmartphone,
  Newspaper,
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
import { getSiteUrl } from "@/lib/links";

const description = "Explore mbioTraders: Gold, forex and BTC/USD signals with five-timeframe alignment, 5-minute entries, economic-news filtering, browser alerts and an installable app.";

const baseMetadata = makeMetadata("mbioTraders — Gold, Forex & Bitcoin Signal Dashboard", description, "/mbiotrade/");
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
  { icon: ChartCandlestick, tag: "LIVE MARKETS", title: "One clear market canvas", description: "Inspect candlesticks, current quotes and nearby levels for Gold, five major forex pairs and BTC/USD, based on available real provider data." },
  { icon: Gauge, tag: "TECHNICAL CONSENSUS", title: "Strength that moves", description: "The live gauge summarizes indicator readings. It is a technical strength estimate, not a probability of a winning trade." },
  { icon: Layers3, tag: "FIVE-FRAME CONFIRMATION", title: "Let the larger trend lead", description: "The 15m, 30m, 1H, 4H and 1D signals must align. The 5m chart is reserved for timing an entry, not voting on the trend." },
  { icon: BellRing, tag: "REAL BROWSER ALERTS", title: "A clear alert when a signal activates", description: "With permission, receive a browser/desktop notification containing direction, entry, stop and target while the app is running." },
  { icon: Radar, tag: "PRECISE ENTRY RULES", title: "Confirmed 5-minute setups", description: "After a countertrend pullback, two directional candles must each have at least 60% body. Entry is at the next 5m candle open, using an earlier swing stop and a 2R target." },
  { icon: Newspaper, tag: "ECONOMIC CALENDAR", title: "Pause around high-impact news", description: "New signals are blocked from three hours before until two hours after relevant high-impact releases. If the calendar is unreliable, new entries wait." },
  { icon: History, tag: "SIGNAL JOURNAL", title: "Keep a clear record", description: "Track active setups until a verified stop or target, review up to 100 completed signals, and export the history as CSV." },
  { icon: MonitorSmartphone, tag: "INSTALLABLE WEB APP", title: "One tap from your device", description: "Install mbioTraders on compatible desktop and mobile browsers for a standalone app experience; live signals still require internet and the app to be open." },
  { icon: RefreshCw, tag: "PROVIDER SAFETY", title: "Know when data is missing", description: "The system can reconnect after interruptions and waits instead of constructing prices or triggering signals from stale or incomplete candles." },
];

const markets = [
  { pair: "XAU/USD", note: "Gold", tag: "METALS" },
  { pair: "EUR/USD", note: "Euro / Dollar", tag: "FOREX" },
  { pair: "GBP/USD", note: "Pound / Dollar", tag: "FOREX" },
  { pair: "USD/JPY", note: "Dollar / Yen", tag: "FOREX" },
  { pair: "AUD/USD", note: "Aussie / Dollar", tag: "FOREX" },
  { pair: "USD/CAD", note: "Dollar / Loonie", tag: "FOREX" },
  { pair: "BTC/USD", note: "Bitcoin / Dollar", tag: "CRYPTO" },
];

const steps = [
  { number: "01", icon: Globe2, title: "Choose a real market", detail: "Explore Gold, five major forex pairs or Bitcoin. Inspect the six chart timeframes and select 3-, 5- or 7-day momentum context." },
  { number: "02", icon: TrendingUp, title: "Confirm all five trends", detail: "15m, 30m, 1H, 4H and daily signals must agree. The 5-minute timeframe is intentionally excluded from trend alignment." },
  { number: "03", icon: ShieldCheck, title: "Wait for a 5m trigger", detail: "Look for an opposite-direction pullback and two completed confirmation candles with at least 60% body each; enter on the third 5m open only if news/data checks are clear. Stop at an earlier 5m pivot; target 2R." },
];

const questions = [
  { q: "Is mbioTraders a broker or automatic trading bot?", a: "No. It provides market analysis and BUY, SELL or WAIT signals. It never places trades, requests broker account credentials or guarantees a result." },
  { q: "Which markets and chart timeframes are supported?", a: "Seven instruments: Gold (XAU/USD), EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD and Bitcoin (BTC/USD). The interface uses 5m, 15m, 30m, 1H, 4H and daily charts, when the upstream feed has real data." },
  { q: "How exactly is a signal detected?", a: "The 15m, 30m, 1H, 4H and daily trends must agree. After a 5-minute pullback against that direction, two completed candles must each have at least 60% body and confirm the higher trend. Entry uses the next 5-minute candle open; an earlier swing determines the stop and the target is twice the risk. Missing or late data blocks the entry." },
  { q: "Why are signals paused around news?", a: "A relevant high-impact calendar event blocks new signals during the three hours before and two hours after its scheduled release. The dashboard also waits if it cannot verify sufficiently fresh calendar coverage." },
  { q: "Can I install mbioTraders on desktop or mobile?", a: "Yes. The live application has an Install App option for supported browsers and Add to Home Screen guidance for iPhone/iPad. It opens like an app, but still needs internet for quotes and must be running for signal monitoring and notifications." },
  { q: "Do browser notifications work after I close the app?", a: "No. When you enable alerts and grant permission, a newly activated signal can trigger an operating-system browser notification while the page or installed app is running. There is no server-side monitoring when it is closed." },
  { q: "Can I review past signals?", a: "Yes. The app keeps up to 100 completed signal results, shows them two per page, and supports CSV export. An active signal remains visible until a verified target or stop." },
  { q: "Where do real market quotes come from?", a: "Gold and forex use configured Twelve Data or supported public Deriv market data; Bitcoin uses Kraken public BTC/USD candles and ticker data. Missing or stale data is not replaced with invented candles." },
  { q: "Does the strength percentage mean the win probability?", a: "No. Strength and confluence describe how technical rules agree. They do not predict or guarantee profitability; screenshots on this portfolio are illustrative." },
];

const projectOrigin = getSiteUrl();
const projectSchema = projectOrigin ? {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "mbioTraders", applicationCategory: "FinanceApplication", operatingSystem: "Web, Android, iOS, Windows, macOS", url: MBIOTRADE_URL, description, creator: { "@type": "Person", name: "Mbiopeter", url: `${projectOrigin}/about/` }, featureList: ["Gold, forex and Bitcoin market charts", "Five-timeframe trend confirmation", "5-minute reversal entry alerts", "Economic calendar safety filter", "Installable browser application", "Signal journal and CSV export"] },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${projectOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Public Projects", item: `${projectOrigin}/public-projects/` },
      { "@type": "ListItem", position: 3, name: "mbioTraders", item: `${projectOrigin}/mbiotrade/` },
    ] },
    { "@type": "FAQPage", mainEntity: questions.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ],
} : null;

export default function MbiotradeLandingPage() {
  return (
    <main id="main" className="page-main mbio-page">
      {projectSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema).replace(/</g, "\\u003c") }} />}
      <nav className="shell mbio-breadcrumb" aria-label="Breadcrumb">
        <Link href="/public-projects/"><ArrowLeft size={14} aria-hidden="true" /> Public Projects</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">mbioTraders</span>
      </nav>

      <section className="shell mbio-hero" aria-labelledby="mbio-title">
        <div className="mbio-hero-copy">
          <span className="mbio-kicker"><span className="mbio-pulse" /> MARKET INTELLIGENCE · BY MBIOPETER</span>
          <h1 id="mbio-title">Trade ideas begin with <span>market clarity.</span></h1>
          <p className="mbio-hero-description">Meet <strong>mbioTraders</strong> — a professional signal dashboard bringing Gold, major forex pairs, Bitcoin (BTC/USD), five aligned higher timeframes, 5-minute entry confirmation and browser alerts into one focused workspace.</p>
          <div className="mbio-hero-actions">
            <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="button mbio-button-primary" data-analytics-event="mbiotraders_launch" data-analytics-label="hero_launch">Launch mbioTraders <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a href="#mbio-tour" className="mbio-button-secondary" data-analytics-event="mbiotraders_tour" data-analytics-label="hero_tour">Explore the dashboard <ArrowRight size={17} aria-hidden="true" /></a>
            <a href="/downloads/mbiotraders-signal-guide.pdf" download className="mbio-button-secondary" data-analytics-event="mbiotraders_guide_download" data-analytics-label="signal_guide"><Download size={16} aria-hidden="true" /> Signal guide (PDF)</a>
          </div>
          <div className="mbio-hero-chips"><span><CheckCircle2 size={13} aria-hidden="true" /> SIGNALS ONLY</span><span><Bitcoin size={13} aria-hidden="true" /> GOLD · FX · BTC</span><span><Layers3 size={13} aria-hidden="true" /> SIX TIMEFRAMES</span></div>
          <p className="mbio-hero-note"><LockKeyhole size={15} aria-hidden="true" /> No trading login or broker order permissions are required to explore the signals.</p>
        </div>
        <div className="mbio-hero-visual">
          <MbiotradePreview />
          <span className="mbio-hero-visual-caption"><Activity size={13} aria-hidden="true" /> Dashboard UI preview · Illustrative readings</span>
        </div>
      </section>

      <section className="shell mbio-facts" aria-label="mbioTraders at a glance">
        <div><strong>07<span className="mbio-facts-accent">.</span></strong><span>Markets to explore</span></div>
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
            <div><p className="eyebrow">GOLD + FOREX + BITCOIN</p><h2 id="mbio-markets-title">Your watchlist. <span className="muted-heading">One interface.</span></h2></div>
            <p>Change instruments or chart timeframes without leaving the dashboard. Each view uses actual provider data when available.</p>
          </div>
          <div className="mbio-market-grid">
            {markets.map((item, index) => (
              <article key={item.pair} className={`mbio-market-card${index === 0 ? " mbio-market-gold" : ""}`}>
                <span className="mbio-market-icon" aria-hidden="true">{index === 0 ? "◆" : item.tag === "CRYPTO" ? "₿" : item.pair.slice(0, 1)}</span>
                <div><small>{item.tag}</small><strong>{item.pair}</strong><span>{item.note}</span></div>
                <MoveUpRight size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
          <div className="mbio-market-timeframes"><Clock3 size={17} aria-hidden="true" /><span>Choose a chart:</span><strong>5m</strong><strong>15m</strong><strong>30m</strong><strong>1H</strong><strong>4H</strong><strong>1D</strong></div>
        </div>
      </section>

      <section id="mbio-workflow" className="shell mbio-section-inner" aria-labelledby="mbio-workflow-title">
        <div className="mbio-section-heading"><p className="eyebrow">A MORE DISCIPLINED PROCESS</p><h2 id="mbio-workflow-title">From trend to setup. <span className="muted-heading">Three steps.</span></h2><p>Higher-timeframe direction, a confirmed 5-minute entry, and strict news/data checks before any new signal.</p></div>
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
          <div className="mbio-faq-intro"><p className="eyebrow">GOOD TO KNOW</p><h2 id="mbio-faq-title">The practical <span className="muted-heading">questions.</span></h2><p>What the signals mean, when alerts work and how the live application differs from this portfolio showcase.</p><a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="mbio-inline-link" data-analytics-event="mbiotraders_launch" data-analytics-label="faq_launch">Open mbioTraders <ArrowUpRight size={16} /><span className="sr-only"> (opens in a new tab)</span></a></div>
          <div className="mbio-faq-list">
            {questions.map(({ q, a }, index) => <details key={q} className="mbio-faq-item"><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{q}</strong><span className="mbio-faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="shell mbio-final-wrap" aria-labelledby="mbio-final-title">
        <div className="mbio-final-cta">
          <div><span className="mbio-final-eyebrow"><Activity size={15} aria-hidden="true" /> MBIOPETER PUBLIC PROJECT</span><h2 id="mbio-final-title">See the bigger picture.<br/><span>Open mbioTraders.</span></h2><p>One dashboard. Seven markets. Context before conviction.</p></div>
          <a href={MBIOTRADE_URL} target="_blank" rel="noopener noreferrer" className="button mbio-button-primary" data-analytics-event="mbiotraders_launch" data-analytics-label="footer_launch">Explore live signals <ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </section>
    </main>
  );
}
