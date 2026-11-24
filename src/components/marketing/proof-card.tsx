"use client";

import { useState } from "react";

// Sample job report shown in the hero. Labelled as an example, not a real job.
export function ProofCard() {
  const [mode, setMode] = useState<"before" | "after">("after");
  const after = mode === "after";

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_-25px_rgba(24,58,47,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-charcoal px-5 py-4 text-off-white">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-gold-light">
            Sample job report
          </p>
          <p className="mt-0.5 text-sm font-semibold">AC servicing &amp; drain flush — Ikeja GRA</p>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[11px] text-gold-light">
          14 Nov 2026
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-black/60">
            Photo proof
          </span>
          <div className="inline-flex rounded-lg border border-line bg-off-white p-1" role="group">
            {(["before", "after"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition ${
                  mode === m ? "bg-charcoal text-white shadow-sm" : "text-navy-black/70 hover:text-navy-black"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-52 overflow-hidden rounded-xl border border-line bg-sand sm:h-56">
          <svg viewBox="0 0 520 260" className="h-full w-full" aria-label={after ? "After servicing" : "Before servicing"}>
            <rect width="520" height="260" fill={after ? "#F4F2EC" : "#E8E4DA"} />
            <line x1="0" y1="210" x2="520" y2="210" stroke="#D5CFC1" strokeWidth="2" />
            {!after && <path d="M290 120 Q305 160 288 205 Q275 170 282 120 Z" fill="#C4B69C" opacity="0.7" />}
            <rect x="115" y="48" width="290" height="72" rx="10" fill={after ? "#FFFFFF" : "#DCDAD3"} stroke={after ? "#183A2F" : "#9E9A90"} strokeWidth="2" />
            <rect x="132" y="88" width="256" height="16" rx="4" fill={after ? "#183A2F" : "#5C5A55"} opacity={after ? 0.14 : 1} />
            <circle cx="378" cy="68" r="5" fill={after ? "#183A2F" : "#C94A38"} />
            {after ? (
              <>
                <path d="M165 128 Q160 144 170 156" stroke="#183A2F" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.45" />
                <path d="M255 128 Q250 144 260 156" stroke="#183A2F" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.45" />
                <path d="M345 128 Q340 144 350 156" stroke="#183A2F" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.45" />
              </>
            ) : (
              <>
                <circle cx="290" cy="134" r="3.5" fill="#648A9E" />
                <circle cx="292" cy="152" r="3" fill="#648A9E" />
                <circle cx="288" cy="172" r="2.5" fill="#648A9E" />
              </>
            )}
            <rect x="28" y="150" width={after ? 230 : 200} height="44" rx="8" fill={after ? "#183A2F" : "#141715"} fillOpacity={after ? 1 : 0.88} />
            <text x="42" y="169" fontSize="11" fontWeight="600" fill="#F7F5F0" fontFamily="sans-serif">
              {after ? "Cleaned, flushed & tested" : "Blocked drain line, leaking"}
            </text>
            <text x="42" y="184" fontSize="9.5" fill="#E6CFA5" fontFamily="monospace">
              {after ? "Photo taken 10:42 WAT" : "Photo taken 09:15 WAT"}
            </text>
          </svg>
          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold ${
              after ? "bg-charcoal text-gold-light" : "bg-[#9B2C2C] text-white"
            }`}
          >
            {after ? "AFTER · 10:42" : "BEFORE · 09:15"}
          </span>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <div className="mb-2.5 flex items-center justify-between font-mono text-xs text-navy-black/60">
            <span>ITEMIZED COSTS</span>
            <span className="font-semibold text-charcoal">NO HIDDEN MARKUP</span>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-navy-black/75">Gas top-up &amp; capacitor (receipt attached)</dt>
              <dd className="font-mono">₦48,000</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-navy-black/75">AC technician labour</dt>
              <dd className="font-mono">₦20,000</dd>
            </div>
            <div className="flex justify-between gap-4 text-charcoal">
              <dt>DFM coordination fee (10%, max ₦20k)</dt>
              <dd className="font-mono">₦6,800</dd>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-line pt-2.5">
              <dt className="font-semibold">Total you approved</dt>
              <dd className="font-mono text-base font-bold text-charcoal">₦74,800</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
