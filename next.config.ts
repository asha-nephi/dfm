import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Lets the dev server accept requests from a phone on the same LAN.
  // Next.js only matches exact hostnames here (no CIDR/wildcard-IP support) —
  // list the machine's actual LAN IPs. Run `ipconfig` (Windows) if these
  // change and add the new one.
  allowedDevOrigins: ["192.168.137.1", "10.158.122.78"],
};

export default nextConfig;
