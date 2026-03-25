import { create } from 'zustand';

export type ToolMode = 'select' | 'place-component' | 'wire';

interface SelectionState {
  toolMode: ToolMode;
  selectedComponentId: string | null;
  setToolMode: (mode: ToolMode) => void;
  setSelectedComponentId: (componentId: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  toolMode: 'select',
  selectedComponentId: null,
  setToolMode: (toolMode) => set({ toolMode }),
  setSelectedComponentId: (selectedComponentId) => set({ selectedComponentId }),
}));
