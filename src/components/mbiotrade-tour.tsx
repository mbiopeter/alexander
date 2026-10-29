"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  ChartCandlestick,
  Gauge,
  Layers3,
  ShieldCheck,
} from "lucide-react";

const tour = [
  {
    id: "chart",
    number: "01",
    icon: ChartCandlestick,
    label: "Market chart",
    title: "Price action, without the clutter.",
    description: "Use a clear candlestick chart, moving averages and nearby market levels to understand what price is doing before looking at the signal.",
    image: "/images/mbiotraders-chart.webp",
    width: 788,
    height: 477,
    detail: "Candlesticks · Moving averages · Market levels",
  },
  {
    id: "strength",
    number: "02",
    icon: Gauge,
    label: "Strength gauge",
    title: "Feel the shift in momentum.",
    description: "An animated technical-consensus gauge summarizes buy, sell and neutral indicator votes. Streaming readings can move the needle; a confirmed signal still waits for a closed candle.",
    image: "/images/mbiotraders-strength.webp",
    width: 391,
    height: 382,
    detail: "Live indicator consensus · Not a win probability",
  },
  {
    id: "alignment",
    number: "03",
    icon: Layers3,
    label: "Trend alignment",
    title: "The larger trend comes first.",
    description: "Compare six timeframes and use the 3-, 5- or 7-day momentum window to evaluate the broader 1H, 4H and daily direction before accepting a shorter-term setup.",
    image: "/images/mbiotraders-alignment.webp",
    width: 789,
    height: 170,
    detail: "5m · 15m · 30m · 1H · 4H · 1D",
  },
  {
    id: "signal",
    number: "04",
    icon: ShieldCheck,
    label: "Entry readiness",
    title: "Know why it's BUY, SELL or WAIT.",
    description: "Each setup includes the direction, rule-based confluence score, indicative entry, stop and targets. An audible alert can notify you when a new qualifying setup is confirmed.",
    image: "/images/mbiotraders-setup.webp",
    width: 425,
    height: 264,
    detail: "Trend · Pullback · Confirmed reversal · Signal plan",
  },
] as const;

type TourId = (typeof tour)[number]["id"];

export function MbiotradeTour() {
  const [active, setActive] = useState<TourId>("chart");
  const current = tour.find((item) => item.id === active)!;

  return (
    <section id="mbio-tour" className="mbio-tour-section" aria-labelledby="mbio-tour-title">
      <div className="shell mbio-section-inner">
        <div className="mbio-section-heading">
          <p className="eyebrow">A CLOSER LOOK / PRODUCT TOUR</p>
          <h2 id="mbio-tour-title">Every important detail. <span className="muted-heading">In its place.</span></h2>
          <p>Explore the core decisions inside mbioTraders. Each panel highlights part of the dashboard design you shared.</p>
        </div>
        <div className="mbio-tour-layout">
          <div className="mbio-tour-options" role="tablist" aria-label="Dashboard feature tour">
            {tour.map(({ id, icon: Icon, label, number, title }) => (
              <button
                key={id}
                type="button"
                id={`mbio-tour-tab-${id}`}
                role="tab"
                aria-selected={active === id}
                aria-controls="mbio-tour-panel"
                tabIndex={active === id ? 0 : -1}
                className={`mbio-tour-option${active === id ? " is-selected" : ""}`}
                onClick={() => setActive(id)}
                onKeyDown={(event) => {
                  const index = tour.findIndex((item) => item.id === active);
                  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    event.preventDefault();
                    const next = tour[(index + 1) % tour.length].id;
                    setActive(next);
                    document.getElementById(`mbio-tour-tab-${next}`)?.focus();
                  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    const next = tour[(index + tour.length - 1) % tour.length].id;
                    setActive(next);
                    document.getElementById(`mbio-tour-tab-${next}`)?.focus();
                  }
                }}
              >
                <span className="mbio-tour-number">{number}</span>
                <span className="mbio-tour-icon"><Icon size={20} aria-hidden="true" /></span>
                <span className="mbio-tour-label"><small>{label}</small><strong>{title}</strong></span>
                <ArrowRight className="mbio-tour-arrow" size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div id="mbio-tour-panel" role="tabpanel" aria-labelledby={`mbio-tour-tab-${active}`} className="mbio-tour-stage" tabIndex={0}>
            <div className={`mbio-tour-image mbio-tour-image-${current.id}`}>
              <Image src={current.image} alt={`Illustrative screenshot detail: ${current.label}`} width={current.width} height={current.height} sizes="(max-width: 900px) 90vw, 600px" />
              <span className="mbio-tour-image-label"><Activity size={12} aria-hidden="true" /> ILLUSTRATIVE UI</span>
            </div>
            <div className="mbio-tour-explanation">
              <span className="mbio-tour-detail">{current.detail}</span>
              <p>{current.description}</p>
            </div>
          </div>
        </div>
        <p className="mbio-demo-disclaimer">Images are visual previews with sample values. This portfolio never streams prices, produces signals, or places orders. The live app is hosted separately.</p>
      </div>
    </section>
  );
}
