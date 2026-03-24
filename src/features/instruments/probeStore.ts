import { create } from 'zustand';

interface ProbeState {
  nodeId: string | null;
  setNodeId: (nodeId: string | null) => void;
}

export const useProbeStore = create<ProbeState>((set) => ({
  nodeId: null,
  setNodeId: (nodeId) => set({ nodeId }),
}));
