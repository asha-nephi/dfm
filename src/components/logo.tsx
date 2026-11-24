// Hexagon "D" monogram. Flat facets so it reads well at favicon size.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20 2 L35.3 11 V29 L20 38 L4.6 29 V11 Z" fill="#183A2F" />
      <path d="M20 2 L35.3 11 V29 L20 20 Z" fill="#B68D4C" />
      <path
        d="M14 12 H19.5C24.5 12 28 15.5 28 20C28 24.5 24.5 28 19.5 28H14V12Z"
        fill="#F7F5F0"
      />
      <path d="M14 12 H19C22.5 12 25 15.2 25 20C25 24.8 22.5 28 19 28H14V12Z" fill="#183A2F" />
    </svg>
  );
}

// Full wordmark: mark + "DESERET / Facility Management Ltd".
export function Wordmark({
  className,
  tone = "dark",
  compact = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  const main = tone === "dark" ? "text-charcoal" : "text-off-white";
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-xl tracking-[0.16em] ${main}`}>DESERET</span>
        {!compact && (
          <span className="mt-0.5 text-[8.5px] font-semibold tracking-[0.24em] uppercase text-amber">
            Facility Management Ltd
          </span>
        )}
      </span>
    </span>
  );
}
