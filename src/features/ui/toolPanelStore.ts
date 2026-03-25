import { create } from 'zustand';
import { getDefaultPanelForSupportLevel } from './toolPanelDefaults';
import type { LessonSupportLevel } from '@/features/lessons/lessonTypes';

export type ToolPanelId = 'inspector' | 'tutor' | 'explain' | 'diagnostics' | 'instruments' | 'flow';

interface ToolPanelState {
  activePanel: ToolPanelId;
  minimizedPanels: Partial<Record<ToolPanelId, boolean>>;
  pinnedPanels: Partial<Record<ToolPanelId, boolean>>;
  setActivePanel: (id: ToolPanelId) => void;
  toggleMinimized: (id: ToolPanelId) => void;
  togglePinned: (id: ToolPanelId) => void;
  applySupportDefaults: (supportLevel: LessonSupportLevel) => void;
}

export const useToolPanelStore = create<ToolPanelState>((set) => ({
  activePanel: 'inspector',
  minimizedPanels: {},
  pinnedPanels: {},
  setActivePanel: (activePanel) => set({ activePanel }),
  toggleMinimized: (id) => set((state) => ({ minimizedPanels: { ...state.minimizedPanels, [id]: !state.minimizedPanels[id] } })),
  togglePinned: (id) => set((state) => ({ pinnedPanels: { ...state.pinnedPanels, [id]: !state.pinnedPanels[id] } })),
  applySupportDefaults: (supportLevel) => set({ activePanel: getDefaultPanelForSupportLevel(supportLevel) }),
}));
