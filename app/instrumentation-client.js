import posthog from "posthog-js";

// Only initialize PostHog in the browser
if (typeof window !== "undefined") {
  // Initialize PostHog for client-side analytics
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // You can add more config here if needed
  });
}

// Usage: Import this file in your top-level client component or layout.
// Requires NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST in your env.
