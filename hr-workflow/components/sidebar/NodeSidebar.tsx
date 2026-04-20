"use client";
import { useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { TEMPLATES } from "@/lib/templates";

const palette = [
  { kind: "start",     label: "Start",          icon: "▶",  desc: "Entry point",       color: "#22c55e" },
  { kind: "task",      label: "Task",            icon: "⬜", desc: "Human task",         color: "#3b82f6" },
  { kind: "approval",  label: "Approval",        icon: "✓",  desc: "Manager sign-off",  color: "#f59e0b" },
  { kind: "automated", label: "Automated Step",  icon: "⚡", desc: "System action",     color: "#8b5cf6" },
  { kind: "end",       label: "End",             icon: "⏹", desc: "Workflow complete",  color: "#ef4444" },
];

export function NodeSidebar({ darkMode }: { darkMode?: boolean }) {
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);

  const bg = darkMode ? "#1e293b" : "#f8fafc";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const cardBg = darkMode ? "#0f172a" : "white";
  const text = darkMode ? "#e2e8f0" : "#1e293b";
  const muted = darkMode ? "#64748b" : "#94a3b8";

  const onDragStart = (e: React.DragEvent, kind: string) => {
    e.dataTransfer.setData("nodeKind", kind);
    e.dataTransfer.effectAllowed = "move";
  };

  const loadTemplate = (index: number) => {
    const t = TEMPLATES[index];
    loadWorkflow(t.nodes, t.edges);
    setTemplatesOpen(false);
  };

  return (
    <aside style={{
      width: 200, borderRight: `1px solid ${border}`,
      background: bg, display: "flex",
      flexDirection: "column", padding: "16px 12px",
      gap: 8, flexShrink: 0, transition: "all 0.2s",
    }}>
      {/* Templates */}
      <div>
        <button
          onClick={() => setTemplatesOpen((v) => !v)}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 10,
            border: `1.5px solid ${border}`,
            background: templatesOpen ? "#eff6ff" : cardBg,
            color: templatesOpen ? "#3b82f6" : muted,
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <span>📋 Templates</span>
          <span>{templatesOpen ? "▲" : "▼"}</span>
        </button>

        {templatesOpen && (
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => loadTemplate(i)}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  border: `1.5px solid ${border}`,
                  background: cardBg, cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b82f6";
                  (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = border;
                  (e.currentTarget as HTMLButtonElement).style.background = cardBg;
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: text }}>{t.name}</div>
                <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>{t.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${border}`, paddingTop: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: muted, letterSpacing: "0.1em", margin: "0 0 8px 4px" }}>
          DRAG TO CANVAS
        </p>
        {palette.map((item) => (
          <div
            key={item.kind}
            draggable
            onDragStart={(e) => onDragStart(e, item.kind)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              background: cardBg, border: `1.5px solid ${border}`,
              cursor: "grab", transition: "all 0.12s",
              userSelect: "none", marginBottom: 8,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = item.color;
              (e.currentTarget as HTMLDivElement).style.transform = "translateX(2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = border;
              (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${item.color}18`,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 15, flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: text }}>{item.label}</div>
              <div style={{ fontSize: 10, color: muted }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}