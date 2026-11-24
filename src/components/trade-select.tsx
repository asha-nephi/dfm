"use client";

import { useState } from "react";

const TRADES = ["Cleaner", "AC Technician", "Electrician", "Plumber", "Generator Technician", "Other"];

// The five trades DFM sells. "Other" stays so a good carpenter or painter isn't turned away.
export function TradeSelect({
  defaultTrade,
  defaultOther,
}: {
  defaultTrade?: string;
  defaultOther?: string;
}) {
  const initialIsKnown = defaultTrade && TRADES.includes(defaultTrade);
  const [trade, setTrade] = useState(initialIsKnown ? defaultTrade! : defaultTrade ? "Other" : TRADES[0]);

  return (
    <div className="space-y-2">
      <select
        name="trade"
        value={trade}
        onChange={(e) => setTrade(e.target.value)}
        className="mt-1 input"
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
          defaultValue={initialIsKnown ? "" : defaultOther ?? defaultTrade ?? ""}
          placeholder="What's your trade?"
          className="input"
        />
      )}
    </div>
  );
}
