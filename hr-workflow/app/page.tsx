"use client";
import { useState } from "react";
import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";
import { NodeSidebar } from "@/components/sidebar/NodeSidebar";
import { NodeFormPanel } from "@/components/forms/NodeFormPanel";
import { SandboxPanel } from "@/components/sandbox/SandboxPanel";
import { useWorkflowStore, useTemporalStore } from "@/store/workflowStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { getAutoLayoutedNodes } from "@/hooks/useAutoLayout";
import type { Node } from "reactflow";
import type { WorkflowNodeData } from "@/types/workflow";

export default function Home() {
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const reset = useWorkflowStore((s) => s.reset);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);

  const undo = useTemporalStore((s) => s.undo);
  const redo = useTemporalStore((s) => s.redo);
  const canUndo = useTemporalStore((s) => s.pastStates.length > 0);
  const canRedo = useTemporalStore((s) => s.futureStates.length > 0);

  // Dark mode colors
  const dm = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    header: darkMode ? "#1e293b" : "white",
    border: darkMode ? "#334155" : "#e2e8f0",
    text: darkMode ? "#e2e8f0" : "#0f172a",
    textMuted: darkMode ? "#64748b" : "#94a3b8",
    btnBg: darkMode ? "#1e293b" : "white",
    btnColor: darkMode ? "#94a3b8" : "#64748b",
    btnBorder: darkMode ? "#334155" : "#e2e8f0",
    sidebarBg: darkMode ? "#1e293b" : "#f8fafc",
  };

  const exportJSON = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (parsed.nodes && parsed.edges) {
            loadWorkflow(parsed.nodes, parsed.edges);
          } else {
            alert("Invalid workflow JSON file");
          }
        } catch {
          alert("Could not parse JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const autoLayout = () => {
    const layouted = getAutoLayoutedNodes(
      nodes as Node<WorkflowNodeData>[],
      edges
    );
    loadWorkflow(layouted, edges);
  };

  useKeyboardShortcuts({
    onUndo: () => undo(),
    onRedo: () => redo(),
    onExport: exportJSON,
  });

  // Status bar stats
  const connectedNodes = nodes.filter((n) => {
    if (n.data.kind === "start") return edges.some((e) => e.source === n.id);
    if (n.data.kind === "end") return edges.some((e) => e.target === n.id);
    return edges.some((e) => e.source === n.id) && edges.some((e) => e.target === n.id);
  }).length;

  const hasStart = nodes.some((n) => n.data.kind === "start");
  const hasEnd = nodes.some((n) => n.data.kind === "end");
  const isValid = hasStart && hasEnd && connectedNodes === nodes.length;

  const btnStyle = {
    fontSize: 12, padding: "5px 14px",
    border: `1.5px solid ${dm.btnBorder}`,
    borderRadius: 7, cursor: "pointer",
    background: dm.btnBg, color: dm.btnColor,
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: dm.bg, transition: "all 0.2s" }}>

      {/* ── Header ── */}
      <header style={{
        height: 52, background: dm.header,
        borderBottom: `1px solid ${dm.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", flexShrink: 0, zIndex: 20,
        transition: "all 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>⚡</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: dm.text }}>HR Workflow Designer</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6", background: "#eff6ff", padding: "2px 8px", borderRadius: 20 }}>
            Tredence Studio
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: dm.textMuted, marginRight: 4 }}>
            {nodes.length} nodes · {edges.length} edges
          </span>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((v) => !v)}
            title="Toggle dark mode"
            style={{ ...btnStyle, fontSize: 16, padding: "3px 10px" }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button onClick={reset} style={btnStyle}>Reset</button>

          <button onClick={() => undo()} disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={{ ...btnStyle, cursor: canUndo ? "pointer" : "not-allowed", color: canUndo ? dm.btnColor : "#cbd5e1" }}>
            ↩ Undo
          </button>

          <button onClick={() => redo()} disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            style={{ ...btnStyle, cursor: canRedo ? "pointer" : "not-allowed", color: canRedo ? dm.btnColor : "#cbd5e1" }}>
            ↪ Redo
          </button>

          <button onClick={autoLayout} title="Auto arrange nodes" style={btnStyle}>
            ⚡ Auto Layout
          </button>

          <button onClick={exportJSON} title="Export (Ctrl+S)" style={btnStyle}>
            Export JSON
          </button>

          <button onClick={importJSON} style={btnStyle}>
            Import JSON
          </button>

          <button onClick={() => setSandboxOpen((v) => !v)}
            style={{
              fontSize: 12, padding: "5px 16px", border: "none", borderRadius: 7,
              cursor: "pointer", background: sandboxOpen ? "#1d4ed8" : "#3b82f6",
              color: "white", fontWeight: 600,
            }}>
            🧪 {sandboxOpen ? "Close Sandbox" : "Run Simulation"}
          </button>
        </div>
      </header>

      {/* ── Main workspace ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <NodeSidebar darkMode={darkMode} />
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <WorkflowCanvas darkMode={darkMode} />
          {sandboxOpen && <SandboxPanel onClose={() => setSandboxOpen(false)} />}
        </div>
        <NodeFormPanel darkMode={darkMode} />
      </div>

      {/* ── Status Bar ── */}
      <div style={{
        height: 28,
        background: isValid
          ? (darkMode ? "#14532d" : "#f0fdf4")
          : (darkMode ? "#450a0a" : "#fef2f2"),
        borderTop: `1px solid ${isValid ? "#86efac" : "#fca5a5"}`,
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 16, flexShrink: 0,
        transition: "all 0.2s",
      }}>
        <span style={{ fontSize: 11, color: isValid ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
          {isValid ? "✓ Workflow valid" : "⚠ Workflow has issues"}
        </span>
        <span style={{ fontSize: 11, color: dm.textMuted }}>Nodes: {nodes.length}</span>
        <span style={{ fontSize: 11, color: dm.textMuted }}>Connected: {connectedNodes}/{nodes.length}</span>
        <span style={{ fontSize: 11, color: hasStart ? "#16a34a" : "#dc2626" }}>
          {hasStart ? "✓" : "✗"} Start
        </span>
        <span style={{ fontSize: 11, color: hasEnd ? "#16a34a" : "#dc2626" }}>
          {hasEnd ? "✓" : "✗"} End
        </span>
        <span style={{ fontSize: 11, color: dm.textMuted, marginLeft: "auto" }}>
          Ctrl+Z undo · Ctrl+Y redo · Ctrl+S export
        </span>
      </div>
    </div>
  );
}