import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/client",
          "/artisan",
          "/dashboard",
          "/cohost/host",
          "/cohost/apply",
          "/reset-password",
        ],
      },
    ],
  };
}
