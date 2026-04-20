import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData, SimulationResult, SimulationStep, ValidationError } from "@/types/workflow";

function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adj[n.id] = [];
  });

  edges.forEach((e) => {
    if (e.source && e.target) {
      adj[e.source].push(e.target);
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    }
  });

  const queue = nodes.filter((n) => inDegree[n.id] === 0);
  const sorted: Node[] = [];

  while (queue.length) {
    const node = queue.shift()!;
    sorted.push(node);
    (adj[node.id] || []).forEach((neighborId) => {
      inDegree[neighborId]--;
      if (inDegree[neighborId] === 0) {
        const neighbor = nodes.find((n) => n.id === neighborId);
        if (neighbor) queue.push(neighbor);
      }
    });
  }

  return sorted;
}

export function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): SimulationResult {
  const errors: ValidationError[] = [];

  const startNodes = nodes.filter((n) => n.data.kind === "start");
  if (startNodes.length === 0) errors.push({ message: "Workflow must have a Start node" });
  if (startNodes.length > 1) errors.push({ message: "Only one Start node is allowed" });

  const endNodes = nodes.filter((n) => n.data.kind === "end");
  if (endNodes.length === 0) errors.push({ message: "Workflow must have an End node" });

  nodes.forEach((n) => {
    if (n.data.kind === "start") {
      const outgoing = edges.filter((e) => e.source === n.id);
      if (outgoing.length === 0)
        errors.push({ nodeId: n.id, message: `Start node "${(n.data as { title: string }).title}" has no outgoing connection` });
    } else if (n.data.kind !== "end") {
      const incoming = edges.filter((e) => e.target === n.id);
      const outgoing = edges.filter((e) => e.source === n.id);
      if (incoming.length === 0) errors.push({ nodeId: n.id, message: `Node is disconnected (no incoming edge)` });
      if (outgoing.length === 0) errors.push({ nodeId: n.id, message: `Node has no outgoing connection` });
    }
  });

  if (errors.length > 0) {
    return { success: false, steps: [], errors: errors.map((e) => e.message) };
  }

  const sorted = topologicalSort(nodes, edges);
  const steps: SimulationStep[] = sorted.map((node) => {
    const data = node.data;
    const title = (data as { title?: string; endMessage?: string }).title
      || (data as { endMessage?: string }).endMessage
      || "Untitled";

    const messages: Record<string, string> = {
      start: `Workflow initiated → "${title}"`,
      task: `Task assigned to ${(data as { assignee?: string }).assignee || "Unassigned"} — "${title}"`,
      approval: `Awaiting approval from ${(data as { approverRole?: string }).approverRole || "Manager"} → "${title}"`,
      automated: `Running automation → "${title}"`,
      end: `Workflow completed → ${(data as { endMessage?: string }).endMessage || "Done"}`,
    };

    return {
      nodeId: node.id,
      nodeTitle: title,
      kind: data.kind,
      status: "success",
      message: messages[data.kind] || "Processed",
    };
  });

  return { success: true, steps, errors: [] };
}