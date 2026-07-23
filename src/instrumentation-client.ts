import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  // No session replay — this app handles landlord/tenant contact details
  // and payment references; skip recording user sessions entirely.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
