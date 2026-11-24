import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deseret Facility Management Ltd",
    short_name: "DFM",
    description:
      "Property care for Lagos homes — book, approve and track jobs from anywhere.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F7F5F0",
    theme_color: "#183A2F",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
