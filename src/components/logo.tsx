// Hexagon/honeycomb "D" monogram — see business_documents/Claude_Code_Build_Brief.md
// Section 2. Kept as simple flat facets so it still reads clearly at favicon size.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20 2 L35.3 11 V29 L20 38 L4.6 29 V11 Z" fill="#1C2233" />
      <path d="M20 2 L35.3 11 V29 L20 20 Z" fill="#D9A441" />
      <path
        d="M14 12 H19.5C24.5 12 28 15.5 28 20C28 24.5 24.5 28 19.5 28H14V12Z"
        fill="#FAF7F1"
      />
      <path d="M14 12 H19C22.5 12 25 15.2 25 20C25 24.8 22.5 28 19 28H14V12Z" fill="#1C2233" />
    </svg>
  );
}
