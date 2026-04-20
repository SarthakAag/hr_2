"use client";
import { useEffect, useState } from "react";
import type { AutomationAction } from "@/types/workflow";

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/automations")
      .then((r) => r.json())
      .then((data) => {
        setAutomations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { automations, loading };
}