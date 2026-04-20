"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from "@/types/workflow";

const kindMeta = {
  start:     { color: "#22c55e", bg: "#f0fdf4", border: "#86efac", icon: "▶", label: "START" },
  task:      { color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", icon: "⬜", label: "TASK" },
  approval:  { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", icon: "✓", label: "APPROVAL" },
  automated: { color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd", icon: "⚡", label: "AUTO" },
  end:       { color: "#ef4444", bg: "#fef2f2", border: "#fca5a5", icon: "⏹", label: "END" },
};

interface BaseNodeProps {
  kind: keyof typeof kindMeta;
  title: string;
  subtitle?: string;
  selected?: boolean;
  hasSource?: boolean;
  hasTarget?: boolean;
  error?: string;
}

function BaseNode({ kind, title, subtitle, selected, hasSource = true, hasTarget = true, error }: BaseNodeProps) {
  const meta = kindMeta[kind];
  const hasError = !!error;

  return (
    <div
      style={{
        minWidth: 180,
        maxWidth: 220,
        background: hasError ? "#fef2f2" : meta.bg,
        border: `2px solid ${hasError ? "#ef4444" : selected ? meta.color : meta.border}`,
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: hasError
          ? "0 0 0 3px #ef444433"
          : selected
          ? `0 0 0 3px ${meta.color}33`
          : "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.15s ease",
        cursor: "pointer",
        fontFamily: "'Inter', 'system-ui', sans-serif",
        position: "relative",
      }}
    >
      {hasTarget && (
        <Handle type="target" position={Position.Top} style={{ background: hasError ? "#ef4444" : meta.color, width: 10, height: 10, border: "2px solid white" }} />
      )}

      {/* Error badge */}
      {hasError && (
        <div style={{
          position: "absolute", top: -8, right: -8,
          width: 18, height: 18, borderRadius: "50%",
          background: "#ef4444", border: "2px solid white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "white", fontWeight: 700,
        }}>
          !
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: subtitle || hasError ? 4 : 0 }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>{meta.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: hasError ? "#ef4444" : meta.color, letterSpacing: "0.08em", marginBottom: 1 }}>
            {meta.label}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title || "Untitled"}
          </div>
        </div>
      </div>

      {subtitle && !hasError && (
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, paddingLeft: 24, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {subtitle}
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div style={{ fontSize: 10, color: "#ef4444", marginTop: 2, paddingLeft: 24 }}>
          {error}
        </div>
      )}

      {hasSource && (
        <Handle type="source" position={Position.Bottom} style={{ background: hasError ? "#ef4444" : meta.color, width: 10, height: 10, border: "2px solid white" }} />
      )}
    </div>
  );
}

export const StartNode = memo(({ data, selected }: NodeProps<StartNodeData>) => (
  <BaseNode kind="start" title={data.title} hasTarget={false} selected={selected} error={(data as StartNodeData & { error?: string }).error} />
));
StartNode.displayName = "StartNode";

export const TaskNode = memo(({ data, selected }: NodeProps<TaskNodeData>) => (
  <BaseNode kind="task" title={data.title} subtitle={data.assignee ? `→ ${data.assignee}` : undefined} selected={selected} error={(data as TaskNodeData & { error?: string }).error} />
));
TaskNode.displayName = "TaskNode";

export const ApprovalNode = memo(({ data, selected }: NodeProps<ApprovalNodeData>) => (
  <BaseNode kind="approval" title={data.title} subtitle={data.approverRole || undefined} selected={selected} error={(data as ApprovalNodeData & { error?: string }).error} />
));
ApprovalNode.displayName = "ApprovalNode";

export const AutomatedNode = memo(({ data, selected }: NodeProps<AutomatedNodeData>) => (
  <BaseNode kind="automated" title={data.title} subtitle={data.actionId || undefined} selected={selected} error={(data as AutomatedNodeData & { error?: string }).error} />
));
AutomatedNode.displayName = "AutomatedNode";

export const EndNode = memo(({ data, selected }: NodeProps<EndNodeData>) => (
  <BaseNode kind="end" title={data.endMessage || "Workflow Complete"} hasSource={false} selected={selected} error={(data as EndNodeData & { error?: string }).error} />
));
EndNode.displayName = "EndNode";