import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from "./CustomNodes";

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
} as const;