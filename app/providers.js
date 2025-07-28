"use client";

import { SessionProvider } from "next-auth/react";
import "../app/instrumentation-client";
import usePostHogIdentify from "./hooks/usePostHogIdentify";

export default function Providers({ children }) {
  usePostHogIdentify();
  return <SessionProvider>{children}</SessionProvider>;
}
