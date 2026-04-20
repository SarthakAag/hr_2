import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData } from "@/types/workflow";

interface WorkflowTemplate {
  name: string;
  description: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export const TEMPLATES: WorkflowTemplate[] = [
  {
    name: "Employee Onboarding",
    description: "Standard new hire onboarding flow",
    nodes: [
      { id: "s1", type: "start", position: { x: 300, y: 40 }, data: { kind: "start", title: "Start Onboarding", metadata: [{ key: "department", value: "Engineering" }] } },
      { id: "t1", type: "task", position: { x: 300, y: 160 }, data: { kind: "task", title: "Collect Documents", description: "Gather joining documents", assignee: "HR Executive", dueDate: "", customFields: [] } },
      { id: "a1", type: "approval", position: { x: 300, y: 280 }, data: { kind: "approval", title: "Manager Approval", approverRole: "Manager", autoApproveThreshold: 3 } },
      { id: "au1", type: "automated", position: { x: 300, y: 400 }, data: { kind: "automated", title: "Send Welcome Email", actionId: "send_email", params: { to: "employee@company.com", subject: "Welcome!", body: "Welcome to the team!" } } },
      { id: "t2", type: "task", position: { x: 300, y: 520 }, data: { kind: "task", title: "Setup Workstation", description: "Configure laptop and tools", assignee: "IT Team", dueDate: "", customFields: [] } },
      { id: "e1", type: "end", position: { x: 300, y: 640 }, data: { kind: "end", endMessage: "Onboarding Complete!", summaryFlag: true } },
    ],
    edges: [
      { id: "e-s1-t1", source: "s1", target: "t1", type: "labeled", data: { label: "" } },
      { id: "e-t1-a1", source: "t1", target: "a1", type: "labeled", data: { label: "" } },
      { id: "e-a1-au1", source: "a1", target: "au1", type: "labeled", data: { label: "Approved" } },
      { id: "e-au1-t2", source: "au1", target: "t2", type: "labeled", data: { label: "" } },
      { id: "e-t2-e1", source: "t2", target: "e1", type: "labeled", data: { label: "" } },
    ],
  },
  {
    name: "Leave Approval",
    description: "Employee leave request workflow",
    nodes: [
      { id: "s1", type: "start", position: { x: 300, y: 40 }, data: { kind: "start", title: "Leave Request", metadata: [] } },
      { id: "t1", type: "task", position: { x: 300, y: 160 }, data: { kind: "task", title: "Submit Leave Form", description: "Fill in leave details", assignee: "Employee", dueDate: "", customFields: [] } },
      { id: "a1", type: "approval", position: { x: 300, y: 280 }, data: { kind: "approval", title: "Manager Approval", approverRole: "Manager", autoApproveThreshold: 2 } },
      { id: "a2", type: "approval", position: { x: 300, y: 400 }, data: { kind: "approval", title: "HR Approval", approverRole: "HRBP", autoApproveThreshold: 1 } },
      { id: "au1", type: "automated", position: { x: 300, y: 520 }, data: { kind: "automated", title: "Notify Employee", actionId: "send_email", params: { to: "employee@company.com", subject: "Leave Approved", body: "Your leave has been approved." } } },
      { id: "e1", type: "end", position: { x: 300, y: 640 }, data: { kind: "end", endMessage: "Leave Approved!", summaryFlag: false } },
    ],
    edges: [
      { id: "e-s1-t1", source: "s1", target: "t1", type: "labeled", data: { label: "" } },
      { id: "e-t1-a1", source: "t1", target: "a1", type: "labeled", data: { label: "" } },
      { id: "e-a1-a2", source: "a1", target: "a2", type: "labeled", data: { label: "Approved" } },
      { id: "e-a2-au1", source: "a2", target: "au1", type: "labeled", data: { label: "Approved" } },
      { id: "e-au1-e1", source: "au1", target: "e1", type: "labeled", data: { label: "" } },
    ],
  },
  {
    name: "Document Verification",
    description: "HR document review and verification",
    nodes: [
      { id: "s1", type: "start", position: { x: 300, y: 40 }, data: { kind: "start", title: "Document Submitted", metadata: [] } },
      { id: "t1", type: "task", position: { x: 300, y: 160 }, data: { kind: "task", title: "Initial Review", description: "Check document completeness", assignee: "HR Executive", dueDate: "", customFields: [] } },
      { id: "a1", type: "approval", position: { x: 300, y: 280 }, data: { kind: "approval", title: "Senior HR Approval", approverRole: "HRBP", autoApproveThreshold: 0 } },
      { id: "au1", type: "automated", position: { x: 300, y: 400 }, data: { kind: "automated", title: "Generate Report", actionId: "generate_doc", params: { template: "verification_report", recipient: "hr@company.com" } } },
      { id: "au2", type: "automated", position: { x: 300, y: 520 }, data: { kind: "automated", title: "Notify Stakeholders", actionId: "slack_notify", params: { channel: "#hr-ops", message: "Document verified successfully" } } },
      { id: "e1", type: "end", position: { x: 300, y: 640 }, data: { kind: "end", endMessage: "Verification Complete", summaryFlag: true } },
    ],
    edges: [
      { id: "e-s1-t1", source: "s1", target: "t1", type: "labeled", data: { label: "" } },
      { id: "e-t1-a1", source: "t1", target: "a1", type: "labeled", data: { label: "" } },
      { id: "e-a1-au1", source: "a1", target: "au1", type: "labeled", data: { label: "Verified" } },
      { id: "e-au1-au2", source: "au1", target: "au2", type: "labeled", data: { label: "" } },
      { id: "e-au2-e1", source: "au2", target: "e1", type: "labeled", data: { label: "" } },
    ],
  },
];