"use client";
import { useWorkflowStore } from "@/store/workflowStore";
import { useSimulation } from "@/hooks/useSimulation";
import type { SimulationStep } from "@/types/workflow";

const kindIcons: Record<string, string> = {
  start: "▶", task: "⬜", approval: "✓", automated: "⚡", end: "⏹",
};

const kindColors: Record<string, string> = {
  start: "#22c55e", task: "#3b82f6", approval: "#f59e0b",
  automated: "#8b5cf6", end: "#ef4444",
};

function StepRow({ step, index }: { step: SimulationStep; index: number }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `${kindColors[step.kind]}18`,
          border: `2px solid ${kindColors[step.kind]}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12,
        }}>
          {kindIcons[step.kind]}
        </div>
        <div style={{ width: 1, flex: 1, background: "#e2e8f0", minHeight: 8 }} />
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>STEP {index + 1}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: kindColors[step.kind], background: `${kindColors[step.kind]}15`, padding: "1px 6px", borderRadius: 4 }}>
            {step.kind.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{step.nodeTitle}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{step.message}</div>
      </div>
      <div style={{ flexShrink: 0, marginTop: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.status === "success" ? "#22c55e" : "#ef4444" }} />
      </div>
    </div>
  );
}

export function SandboxPanel({ onClose }: { onClose: () => void }) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { result, running, run, clear } = useSimulation();

  const handleRun = async () => {
    const { getNodeErrors } = await import("@/lib/validateWorkflow");
    const errors = getNodeErrors(nodes, edges);
    nodes.forEach((n) => {
      updateNodeData(n.id, { error: errors[n.id] || "" } as never);
    });
    run(nodes, edges);
  };

  const handleClear = () => {
    nodes.forEach((n) => {
      updateNodeData(n.id, { error: "" } as never);
    });
    clear();
  };

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 200, right: 256,
      background: "white", borderTop: "2px solid #e2e8f0",
      display: "flex", flexDirection: "column", maxHeight: 320, zIndex: 10,
    }}>
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>🧪 Simulation Sandbox</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{nodes.length} nodes · {edges.length} edges</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleClear} disabled={running || !result}
            style={{ fontSize: 12, padding: "5px 12px", border: "1.5px solid #e2e8f0", borderRadius: 7, cursor: "pointer", background: "white", color: "#64748b" }}>
            Clear
          </button>
          <button onClick={handleRun} disabled={running}
            style={{ fontSize: 12, padding: "5px 16px", border: "none", borderRadius: 7, cursor: running ? "not-allowed" : "pointer", background: running ? "#94a3b8" : "#3b82f6", color: "white", fontWeight: 600 }}>
            {running ? "Running…" : "▶ Run Simulation"}
          </button>
          <button onClick={onClose}
            style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            ✕
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {running && (
          <div style={{ padding: "20px 0", textAlign: "center", color: "#64748b", fontSize: 13 }}>
            ⚙️ Processing workflow…
          </div>
        )}
        {result && !running && (
          <>
            {result.errors.length > 0 && (
              <div style={{ margin: "12px 0", padding: "10px 14px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fca5a5" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>Validation Errors</div>
                {result.errors.map((e, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#dc2626" }}>• {e}</div>
                ))}
              </div>
            )}
            {result.success && (
              <div style={{ margin: "8px 0" }}>
                <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginBottom: 4 }}>✓ SIMULATION COMPLETE</div>
                {result.steps.map((step, i) => <StepRow key={step.nodeId} step={step} index={i} />)}
              </div>
            )}
          </>
        )}
        {!result && !running && (
          <div style={{ padding: "24px 0", textAlign: "center", color: "#cbd5e1", fontSize: 13 }}>
            Run the simulation to see step-by-step execution
          </div>
        )}
      </div>
    </div>
  );
}