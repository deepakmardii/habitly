import { useEffect } from "react";
import posthog from "posthog-js";
import { useSession } from "next-auth/react";

export default function usePostHogIdentify() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      posthog.identify(session.user.email);
    }
  }, [status, session]);
}
