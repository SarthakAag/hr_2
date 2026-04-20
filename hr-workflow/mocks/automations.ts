import type { AutomationAction } from "@/types/workflow";

export const AUTOMATIONS: AutomationAction[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "slack_notify", label: "Slack Notification", params: ["channel", "message"] },
  { id: "create_jira", label: "Create Jira Ticket", params: ["project", "summary", "assignee"] },
  { id: "update_hris", label: "Update HRIS Record", params: ["employeeId", "field", "value"] },
  { id: "schedule_meeting", label: "Schedule Meeting", params: ["attendees", "duration", "title"] },
];