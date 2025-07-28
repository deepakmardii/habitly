"use client";

import { SessionProvider } from "next-auth/react";
import "../app/instrumentation-client";
import PostHogIdentify from "./components/PostHogIdentify";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <PostHogIdentify />
      {children}
    </SessionProvider>
  );
}
