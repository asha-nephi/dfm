"use client";

import { useState } from "react";
import { rateWorkOrder } from "./actions";

export function RatingForm({
  workOrderId,
  propertyId,
}: {
  workOrderId: string;
  propertyId: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <form action={rateWorkOrder} className="mt-3 flex flex-wrap items-center gap-3">
      <input type="hidden" name="workOrderId" value={workOrderId} />
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Rate this job">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 text-xl leading-none"
          >
            <span className={(hover || rating) >= n ? "text-amber" : "text-charcoal/20"}>
              &#9733;
            </span>
          </button>
        ))}
      </div>
      <input
        name="note"
        placeholder="Optional note (e.g. tidy, on time)"
        className="min-w-[180px] flex-1 rounded-md border border-charcoal/20 px-2.5 py-1.5 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
      />
      <button
        type="submit"
        disabled={rating === 0}
        className="rounded-lg bg-charcoal px-3 py-1.5 text-sm font-medium text-off-white shadow-sm transition-colors hover:bg-navy-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        Rate job
      </button>
    </form>
  );
}
