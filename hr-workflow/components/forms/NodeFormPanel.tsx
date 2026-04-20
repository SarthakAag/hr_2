"use client";
import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useWorkflowStore } from "@/store/workflowStore";
import { useAutomations } from "@/hooks/useAutomations";
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData,
  AutomatedNodeData, EndNodeData, WorkflowNodeData,
} from "@/types/workflow";
import type { Node } from "reactflow";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "6px 10px", borderRadius: 7,
  border: "1.5px solid #e2e8f0", fontSize: 13, background: "white",
  outline: "none", boxSizing: "border-box", color: "#1e293b",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#64748b",
  letterSpacing: "0.05em", display: "block", marginBottom: 4,
};
const fieldWrap: React.CSSProperties = { marginBottom: 12 };

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ fontSize: 11, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      + Add field
    </button>
  );
}

function StartForm({ node }: { node: Node<StartNodeData> }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, control } = useForm<StartNodeData>({ defaultValues: node.data });
  const { fields, append, remove } = useFieldArray({ control, name: "metadata" });
  const data = watch();
  const prev = useRef("");
  useEffect(() => {
    const str = JSON.stringify(data);
    if (str === prev.current) return;
    prev.current = str;
    updateNodeData(node.id, data);
  });

  return (
    <form>
      <div style={fieldWrap}>
        <label style={labelStyle}>TITLE</label>
        <input style={inputStyle} {...register("title")} placeholder="Start title" />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>METADATA</label>
        {fields.map((f, i) => (
          <div key={f.id} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <input style={{ ...inputStyle, flex: 1 }} {...register(`metadata.${i}.key`)} placeholder="Key" />
            <input style={{ ...inputStyle, flex: 1 }} {...register(`metadata.${i}.value`)} placeholder="Value" />
            <button type="button" onClick={() => remove(i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        ))}
        <AddBtn onClick={() => append({ key: "", value: "" })} />
      </div>
    </form>
  );
}

function TaskForm({ node }: { node: Node<TaskNodeData> }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch, control } = useForm<TaskNodeData>({ defaultValues: node.data });
  const { fields, append, remove } = useFieldArray({ control, name: "customFields" });
  const data = watch();
  const prev = useRef("");
  useEffect(() => {
    const str = JSON.stringify(data);
    if (str === prev.current) return;
    prev.current = str;
    updateNodeData(node.id, data);
  });

  return (
    <form>
      <div style={fieldWrap}>
        <label style={labelStyle}>TITLE *</label>
        <input style={inputStyle} {...register("title")} placeholder="Task name" />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} {...register("description")} placeholder="What needs to be done?" />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>ASSIGNEE</label>
        <input style={inputStyle} {...register("assignee")} placeholder="Person or role" />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>DUE DATE</label>
        <input style={inputStyle} type="date" {...register("dueDate")} />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>CUSTOM FIELDS</label>
        {fields.map((f, i) => (
          <div key={f.id} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <input style={{ ...inputStyle, flex: 1 }} {...register(`customFields.${i}.key`)} placeholder="Key" />
            <input style={{ ...inputStyle, flex: 1 }} {...register(`customFields.${i}.value`)} placeholder="Value" />
            <button type="button" onClick={() => remove(i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        ))}
        <AddBtn onClick={() => append({ key: "", value: "" })} />
      </div>
    </form>
  );
}

function ApprovalForm({ node }: { node: Node<ApprovalNodeData> }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch } = useForm<ApprovalNodeData>({ defaultValues: node.data });
  const data = watch();
  const prev = useRef("");
  useEffect(() => {
    const str = JSON.stringify(data);
    if (str === prev.current) return;
    prev.current = str;
    updateNodeData(node.id, data);
  });

  return (
    <form>
      <div style={fieldWrap}>
        <label style={labelStyle}>TITLE</label>
        <input style={inputStyle} {...register("title")} placeholder="Approval step name" />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>APPROVER ROLE</label>
        <select style={{ ...inputStyle }} {...register("approverRole")}>
          <option value="">Select role…</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="CEO">CEO</option>
        </select>
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>AUTO-APPROVE THRESHOLD (DAYS)</label>
        <input style={inputStyle} type="number" min={0} {...register("autoApproveThreshold", { valueAsNumber: true })} placeholder="0 = never" />
      </div>
    </form>
  );
}

function AutomatedForm({ node }: { node: Node<AutomatedNodeData> }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { automations } = useAutomations();
  const { register, watch, setValue } = useForm<AutomatedNodeData>({ defaultValues: node.data });
  const data = watch();
  const selectedAction = automations.find((a) => a.id === data.actionId);
  const prev = useRef("");
  useEffect(() => {
    const str = JSON.stringify(data);
    if (str === prev.current) return;
    prev.current = str;
    updateNodeData(node.id, data);
  });

  return (
    <form>
      <div style={fieldWrap}>
        <label style={labelStyle}>TITLE</label>
        <input style={inputStyle} {...register("title")} placeholder="Step name" />
      </div>
      <div style={fieldWrap}>
        <label style={labelStyle}>ACTION</label>
        <select style={inputStyle} {...register("actionId")} onChange={(e) => {
          setValue("actionId", e.target.value);
          setValue("params", {});
        }}>
          <option value="">Select automation…</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div style={fieldWrap}>
          <label style={labelStyle}>PARAMETERS</label>
          {selectedAction.params.map((param) => (
            <div key={param} style={{ marginBottom: 6 }}>
              <label style={{ ...labelStyle, color: "#94a3b8", fontSize: 10 }}>{param.toUpperCase()}</label>
              <input style={inputStyle} {...register(`params.${param}`)} placeholder={param} />
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

function EndForm({ node }: { node: Node<EndNodeData> }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const { register, watch } = useForm<EndNodeData>({ defaultValues: node.data });
  const data = watch();
  const prev = useRef("");
  useEffect(() => {
    const str = JSON.stringify(data);
    if (str === prev.current) return;
    prev.current = str;
    updateNodeData(node.id, data);
  });

  return (
    <form>
      <div style={fieldWrap}>
        <label style={labelStyle}>END MESSAGE</label>
        <input style={inputStyle} {...register("endMessage")} placeholder="Workflow completed successfully" />
      </div>
      <div style={fieldWrap}>
        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" {...register("summaryFlag")} style={{ width: 15, height: 15 }} />
          <span>Generate summary report</span>
        </label>
      </div>
    </form>
  );
}

const kindLabels: Record<string, string> = {
  start: "Start Node", task: "Task Node", approval: "Approval Node",
  automated: "Automated Step", end: "End Node",
};

const kindColors: Record<string, string> = {
  start: "#22c55e", task: "#3b82f6", approval: "#f59e0b",
  automated: "#8b5cf6", end: "#ef4444",
};

export function NodeFormPanel({ darkMode }: { darkMode?: boolean }) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  const node = nodes.find((n) => n.id === selectedNodeId);

  const border = darkMode ? "#334155" : "#e2e8f0";

  if (!node) return (
    <div style={{
      width: 256,
      borderLeft: `1px solid ${border}`,
      background: darkMode ? "#1e293b" : "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#94a3b8", fontSize: 12, flexShrink: 0,
      transition: "all 0.2s",
    }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>←</div>
        <div>Select a node to edit</div>
      </div>
    </div>
  );

  const kind = node.data.kind;
  const color = kindColors[kind];

  return (
    <aside style={{
      width: 256,
      borderLeft: `1px solid ${border}`,
      background: darkMode ? "#1e293b" : "white",
      display: "flex", flexDirection: "column",
      flexShrink: 0, transition: "all 0.2s",
    }}>
      <div style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "0.08em" }}>{kindLabels[kind]}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1, fontFamily: "monospace" }}>{node.id}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => deleteNode(node.id)} title="Delete node"
            style={{ background: "#fef2f2", border: "none", color: "#ef4444", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
          <button onClick={() => selectNode(null)} title="Close"
            style={{ background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: "#64748b", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ×
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        {kind === "start"     && <StartForm     node={node as Node<StartNodeData>} />}
        {kind === "task"      && <TaskForm      node={node as Node<TaskNodeData>} />}
        {kind === "approval"  && <ApprovalForm  node={node as Node<ApprovalNodeData>} />}
        {kind === "automated" && <AutomatedForm node={node as Node<AutomatedNodeData>} />}
        {kind === "end"       && <EndForm       node={node as Node<EndNodeData>} />}
      </div>
    </aside>
  );
}