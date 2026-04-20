"use client";
import { useState } from "react";
import type { Node, Edge } from "reactflow";
import type { SimulationResult, WorkflowNodeData } from "@/types/workflow";

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = async (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });
      const data: SimulationResult = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, steps: [], errors: ["Network error — simulation failed"] });
    } finally {
      setRunning(false);
    }
  };

  const clear = () => setResult(null);

  return { result, running, run, clear };
}