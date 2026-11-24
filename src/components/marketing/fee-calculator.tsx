"use client";

import { useState } from "react";
import { COORDINATION_CAP, COORDINATION_RATE } from "@/lib/services";
import { formatNaira } from "@/lib/format";

// Shows how the 10% coordination fee and its ₦20k cap work on any job size.
export function FeeCalculator() {
  const [cost, setCost] = useState(250000);
  const raw = Math.round(cost * COORDINATION_RATE);
  const fee = Math.min(raw, COORDINATION_CAP);
  const capped = raw > COORDINATION_CAP;

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="fee-slider" className="text-sm font-semibold text-navy-black">
          Artisan &amp; materials cost for a job
        </label>
        <span className="font-mono text-2xl font-bold text-charcoal sm:text-3xl">{formatNaira(cost)}</span>
      </div>
      <input
        id="fee-slider"
        type="range"
        min={10000}
        max={500000}
        step={5000}
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
        className="my-4 w-full accent-charcoal"
      />
      <div className="mb-6 flex justify-between font-mono text-xs text-navy-black/45">
        <span>₦10,000</span>
        <span>₦200,000 = cap reached</span>
        <span>₦500,000</span>
      </div>
      <dl className="space-y-2.5 rounded-xl border border-line bg-off-white p-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-navy-black/70">Artisan &amp; materials (actual cost)</dt>
          <dd className="font-mono">{formatNaira(cost)}</dd>
        </div>
        <div className="flex justify-between text-charcoal">
          <dt className="flex items-center gap-2">
            DFM coordination fee
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                capped ? "bg-charcoal text-white" : "bg-charcoal/10 text-charcoal"
              }`}
            >
              {capped ? "₦20K CAP APPLIED" : "10%"}
            </span>
          </dt>
          <dd className="font-mono font-semibold">{formatNaira(fee)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="font-semibold">Total for the job</dt>
          <dd className="font-mono text-xl font-bold text-charcoal">{formatNaira(cost + fee)}</dd>
        </div>
      </dl>
    </div>
  );
}
