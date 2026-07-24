import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deseret Facility Management",
    short_name: "DFM",
    description:
      "Verified, transparent facility management for property owners who can't be there in person, wherever you are.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FAF7F1",
    theme_color: "#1C2233",
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
