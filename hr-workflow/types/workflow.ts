export type NodeKind = "start" | "task" | "approval" | "automated" | "end";

export interface KVPair {
  key: string;
  value: string;
}

export interface StartNodeData {
  kind: "start";
  title: string;
  metadata: KVPair[];
}

export interface TaskNodeData {
  kind: "task";
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KVPair[];
}

export interface ApprovalNodeData {
  kind: "approval";
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  kind: "automated";
  title: string;
  actionId: string;
  params: Record<string, string>;
}

export interface EndNodeData {
  kind: "end";
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeTitle: string;
  kind: NodeKind;
  status: "success" | "pending" | "error";
  message: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
}