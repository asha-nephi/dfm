import { ImageResponse } from "next/og";

export const alt = "Deseret Facility Management — verified, transparent property management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1C2233",
          padding: "80px",
        }}
      >
        <svg width="72" height="72" viewBox="0 0 40 40" style={{ marginBottom: 40 }}>
          <path d="M20 2 L35.3 11 V29 L20 38 L4.6 29 V11 Z" fill="#D9A441" />
          <path
            d="M14 12 H19.5C24.5 12 28 15.5 28 20C28 24.5 24.5 28 19.5 28H14V12Z"
            fill="#FAF7F1"
          />
          <path d="M14 12 H19C22.5 12 25 15.2 25 20C25 24.8 22.5 28 19 28H14V12Z" fill="#1C2233" />
        </svg>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#D9A441",
            marginBottom: 20,
          }}
        >
          Deseret Facility Management
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#FAF7F1",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Verified, transparent property management for landlords who can&apos;t be there.
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(250,247,241,0.7)",
            marginTop: 32,
            maxWidth: 900,
          }}
        >
          Dated photos of every job, itemized costs, one flat fee.
        </div>
      </div>
    ),
    { ...size },
  );
}
