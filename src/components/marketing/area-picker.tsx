"use client";

import { useState } from "react";
import { SERVICE_AREAS } from "@/lib/services";

// Location input with quick-pick area chips.
export function AreaPicker() {
  const [value, setValue] = useState("");
  return (
    <div>
      <label htmlFor="property_location" className="label">
        Property location
      </label>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {SERVICE_AREAS.map((a) => {
          const picked = value === `${a}, Lagos`;
          return (
            <button
              key={a}
              type="button"
              onClick={() => setValue(`${a}, Lagos`)}
              aria-pressed={picked}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                picked
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-line bg-white text-charcoal hover:border-charcoal/40"
              }`}
            >
              {a}
            </button>
          );
        })}
      </div>
      <input
        id="property_location"
        name="property_location"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pick an area above or type your address"
        className="input"
      />
    </div>
  );
}
