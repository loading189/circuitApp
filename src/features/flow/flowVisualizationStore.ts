import { create } from 'zustand';

export interface FlowVisualizationState {
  enabled: boolean;
  showDirectionArrows: boolean;
  emphasizeBrokenPaths: boolean;
  intensityScale: number;
  toggleEnabled: () => void;
  setShowDirectionArrows: (value: boolean) => void;
  setEmphasizeBrokenPaths: (value: boolean) => void;
  setIntensityScale: (value: number) => void;
}

export const useFlowVisualizationStore = create<FlowVisualizationState>((set) => ({
  enabled: false,
  showDirectionArrows: true,
  emphasizeBrokenPaths: true,
  intensityScale: 1,
  toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),
  setShowDirectionArrows: (showDirectionArrows) => set({ showDirectionArrows }),
  setEmphasizeBrokenPaths: (emphasizeBrokenPaths) => set({ emphasizeBrokenPaths }),
  setIntensityScale: (intensityScale) => set({ intensityScale: Math.max(0.4, Math.min(intensityScale, 1.8)) }),
}));
