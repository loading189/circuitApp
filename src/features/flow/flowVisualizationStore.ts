import { create } from 'zustand';

export interface FlowVisualizationState {
  enabled: boolean;
  showDirectionArrows: boolean;
  emphasizeBrokenPaths: boolean;
  intensityScale: number;
  toggleEnabled: () => void;
  setEnabled: (value: boolean) => void;
  setShowDirectionArrows: (value: boolean) => void;
  setEmphasizeBrokenPaths: (value: boolean) => void;
  setIntensityScale: (value: number) => void;
  reset: () => void;
}

const DEFAULT_FLOW_STATE = {
  enabled: false,
  showDirectionArrows: true,
  emphasizeBrokenPaths: true,
  intensityScale: 1,
} as const;

export const useFlowVisualizationStore = create<FlowVisualizationState>((set) => ({
  ...DEFAULT_FLOW_STATE,
  toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),
  setEnabled: (enabled) => set({ enabled }),
  setShowDirectionArrows: (showDirectionArrows) => set({ showDirectionArrows }),
  setEmphasizeBrokenPaths: (emphasizeBrokenPaths) => set({ emphasizeBrokenPaths }),
  setIntensityScale: (intensityScale) => set({ intensityScale: Math.max(0.4, Math.min(intensityScale, 1.8)) }),
  reset: () => set({ ...DEFAULT_FLOW_STATE }),
}));
