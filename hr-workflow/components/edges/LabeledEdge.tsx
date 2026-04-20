"use client";
import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "reactflow";

export function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data?.label || "");

  const handleDoubleClick = () => setEditing(true);

  const handleBlur = () => {
    setEditing(false);
    if (data?.onLabelChange) data.onLabelChange(id, label);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: "#94a3b8", strokeWidth: 2, ...style }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onDoubleClick={handleDoubleClick}
        >
          {editing ? (
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => { if (e.key === "Enter") handleBlur(); }}
              style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 20,
                border: "1.5px solid #3b82f6", outline: "none",
                background: "white", color: "#1e293b",
                width: 100, textAlign: "center",
              }}
            />
          ) : (
            label && (
              <div style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 20,
                background: "white", border: "1.5px solid #e2e8f0",
                color: "#64748b", cursor: "pointer", whiteSpace: "nowrap",
              }}
                title="Double-click to edit"
              >
                {label}
              </div>
            )
          )}
          {!label && (
            <div
              style={{
                fontSize: 10, padding: "2px 6px", borderRadius: 20,
                background: "#f8fafc", border: "1px dashed #cbd5e1",
                color: "#cbd5e1", cursor: "pointer", whiteSpace: "nowrap",
              }}
              title="Double-click to add label"
            >
              + label
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}