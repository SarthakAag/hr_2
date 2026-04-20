"use client";
import { useCallback, useRef, useState, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "@/store/workflowStore";
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from "@/components/nodes/CustomNodes";
import { LabeledEdge } from "@/components/edges/LabeledEdge";
import type { WorkflowNodeData, NodeKind } from "@/types/workflow";

const defaultDataByKind: Record<NodeKind, WorkflowNodeData> = {
  start: { kind: "start", title: "Start", metadata: [] },
  task: { kind: "task", title: "New Task", description: "", assignee: "", dueDate: "", customFields: [] },
  approval: { kind: "approval", title: "Approval", approverRole: "Manager", autoApproveThreshold: 0 },
  automated: { kind: "automated", title: "Automated Step", actionId: "", params: {} },
  end: { kind: "end", endMessage: "Workflow Complete", summaryFlag: false },
};

let nodeIdCounter = 100;

export function WorkflowCanvas({ darkMode }: { darkMode?: boolean }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const nodeTypes = useMemo(() => ({
    start: StartNode,
    task: TaskNode,
    approval: ApprovalNode,
    automated: AutomatedNode,
    end: EndNode,
  }), []);

  const edgeTypes = useMemo(() => ({
    labeled: LabeledEdge,
  }), []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData("nodeKind") as NodeKind;
      if (!kind || !rfInstance || !reactFlowWrapper.current) return;

      const position = rfInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const id = `${kind}-${++nodeIdCounter}`;
      addNode({
        id,
        type: kind,
        position,
        data: { ...defaultDataByKind[kind] },
      });
      selectNode(id);
    },
    [rfInstance, addNode, selectNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const canvasBg = darkMode ? "#0f172a" : "#f8fafc";
  const gridColor = darkMode ? "#1e293b" : "#e2e8f0";
  const controlsBorder = darkMode ? "#334155" : "#e2e8f0";
  const maskColor = darkMode ? "rgba(15,23,42,0.7)" : "rgba(248,250,252,0.7)";
  const hintColor = darkMode ? "#334155" : "#cbd5e1";

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        deleteKeyCode="Delete"
        style={{ width: "100%", height: "100%", background: canvasBg, transition: "background 0.2s" }}
        defaultEdgeOptions={{
          type: "labeled",
          style: { stroke: "#94a3b8", strokeWidth: 2 },
          animated: false,
          data: { label: "" },
        }}
        connectionLineStyle={{ stroke: "#3b82f6", strokeWidth: 2 }}
      >
        <Background color={gridColor} gap={24} size={1.5} />
        <Controls
          style={{
            boxShadow: "none",
            border: `1.5px solid ${controlsBorder}`,
            borderRadius: 10,
            background: darkMode ? "#1e293b" : "white",
          }}
        />
        <MiniMap
          style={{
            border: `1.5px solid ${controlsBorder}`,
            borderRadius: 10,
            background: darkMode ? "#1e293b" : "white",
          }}
          nodeColor={(n) => {
            const map: Record<string, string> = {
              start: "#22c55e", task: "#3b82f6", approval: "#f59e0b",
              automated: "#8b5cf6", end: "#ef4444",
            };
            return map[n.type ?? ""] ?? "#94a3b8";
          }}
          maskColor={maskColor}
        />
      </ReactFlow>

      {nodes.length <= 1 && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none", textAlign: "center",
          color: hintColor, userSelect: "none",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⬅</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Drag nodes from the sidebar</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Connect them by dragging between handles</div>
        </div>
      )}
    </div>
  );
}