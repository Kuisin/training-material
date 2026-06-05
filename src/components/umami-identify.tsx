import { useEffect } from "react";
import { getOrCreateUserId } from "../lib/user-id";

declare global {
  interface Window {
    umami?: {
      identify: (data: Record<string, string>) => void;
    };
  }
}

export function UmamiIdentify() {
  useEffect(() => {
    const userId = getOrCreateUserId();
    window.umami?.identify({ userId });
  }, []);

  return null;
}
