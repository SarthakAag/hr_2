"use client";
import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function startMSW() {
      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
      setReady(true);
    }

    startMSW();
  }, []);

  if (!ready) {
    return (
      <div style={{
        height: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#f8fafc",
        fontFamily: "system-ui", color: "#94a3b8", fontSize: 14,
      }}>
        Initialising…
      </div>
    );
  }

  return <>{children}</>;
}