import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.2,
  // Payment/webhook routes and cron jobs matter most — keep full traces
  // there via tracesSampler if volume ever becomes a cost concern.
  debug: false,
});
