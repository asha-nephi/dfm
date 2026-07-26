"use client";

import { useState } from "react";

const TRADES = ["Plumber", "Electrician", "AC Technician", "Other"];

// DFM is prioritizing these three trades specifically — "Other" stays
// available so a genuinely useful carpenter/painter isn't turned away
// outright, it just isn't the primary recruiting focus right now.
export function TradeSelect() {
  const [trade, setTrade] = useState(TRADES[0]);

  return (
    <div className="space-y-2">
      <select
        name="trade"
        value={trade}
        onChange={(e) => setTrade(e.target.value)}
        className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
      >
        {TRADES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {trade === "Other" && (
        <input
          name="trade_other"
          type="text"
          required
          placeholder="What's your trade?"
          className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
      )}
    </div>
  );
}
