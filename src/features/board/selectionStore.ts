import { create } from 'zustand';

export type ToolMode = 'select' | 'place-component' | 'wire' | 'probe' | 'pan';

interface SelectionState {
  toolMode: ToolMode;
  selectedComponentId: string | null;
  selectedWireId: string | null;
  setToolMode: (mode: ToolMode) => void;
  setSelectedComponentId: (componentId: string | null) => void;
  setSelectedWireId: (wireId: string | null) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  toolMode: 'select',
  selectedComponentId: null,
  selectedWireId: null,
  setToolMode: (toolMode) => set({ toolMode }),
  setSelectedComponentId: (selectedComponentId) => set({ selectedComponentId, selectedWireId: null }),
  setSelectedWireId: (selectedWireId) => set({ selectedWireId, selectedComponentId: null }),
  clearSelection: () => set({ selectedComponentId: null, selectedWireId: null }),
}));
