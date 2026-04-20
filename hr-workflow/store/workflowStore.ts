import { create } from "zustand";
import { temporal } from "zundo";
import { useStore } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
} from "reactflow";
import type { WorkflowNodeData } from "@/types/workflow";

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  addNode: (node: Node<WorkflowNodeData>) => void;
  reset: () => void;
  loadWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void;
}

const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: "start-1",
    type: "start",
    position: { x: 300, y: 60 },
    data: { kind: "start", title: "Begin Onboarding", metadata: [] },
  },
];

export const useWorkflowStore = create<WorkflowState>()(
  temporal(
    (set) => ({
      nodes: initialNodes,
      edges: [] as Edge[],
      selectedNodeId: null as string | null,

      onNodesChange: (changes) =>
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes) as Node<WorkflowNodeData>[],
        })),

      onEdgesChange: (changes) =>
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
        })),

      onConnect: (connection) =>
        set((state) => ({
          edges: addEdge({ ...connection, animated: false }, state.edges),
        })),

      selectNode: (id) => set({ selectedNodeId: id }),

      updateNodeData: (id, data) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === id
              ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData }
              : n
          ),
        })),

      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          edges: state.edges.filter((e) => e.source !== id && e.target !== id),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        })),

      addNode: (node) =>
        set((state) => ({ nodes: [...state.nodes, node] })),

      reset: () => set({ nodes: initialNodes, edges: [], selectedNodeId: null }),

      loadWorkflow: (nodes, edges) => set({ nodes, edges, selectedNodeId: null }),
    }),
    {
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);

export const useTemporalStore = <T>(
  selector: (state: ReturnType<typeof useWorkflowStore.temporal.getState>) => T
): T => useStore(useWorkflowStore.temporal, selector);