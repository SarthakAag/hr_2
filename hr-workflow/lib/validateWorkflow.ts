import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData } from "@/types/workflow";

export function getNodeErrors(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  const startNodes = nodes.filter((n) => n.data.kind === "start");
  const endNodes = nodes.filter((n) => n.data.kind === "end");

  if (startNodes.length === 0) {
    nodes.forEach((n) => (errors[n.id] = "No Start node in workflow"));
  }

  if (startNodes.length > 1) {
    startNodes.forEach((n) => (errors[n.id] = "Only one Start node allowed"));
  }

  if (endNodes.length === 0) {
    nodes.forEach((n) => (errors[n.id] = "No End node in workflow"));
  }

  nodes.forEach((n) => {
    if (n.data.kind === "start") {
      const outgoing = edges.filter((e) => e.source === n.id);
      if (outgoing.length === 0) errors[n.id] = "Start node has no outgoing connection";
    } else if (n.data.kind === "end") {
      const incoming = edges.filter((e) => e.target === n.id);
      if (incoming.length === 0) errors[n.id] = "End node has no incoming connection";
    } else {
      const incoming = edges.filter((e) => e.target === n.id);
      const outgoing = edges.filter((e) => e.source === n.id);
      if (incoming.length === 0) errors[n.id] = "Node has no incoming connection";
      else if (outgoing.length === 0) errors[n.id] = "Node has no outgoing connection";
    }
  });

  return errors;
}