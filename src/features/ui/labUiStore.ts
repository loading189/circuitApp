import { create } from 'zustand';

export type LabMode = 'free' | 'guided';

interface LabUiState {
  mode: LabMode;
  activeLessonTitle: string;
  setMode: (mode: LabMode) => void;
}

export const useLabUiStore = create<LabUiState>((set) => ({
  mode: 'guided',
  activeLessonTitle: 'LED Current Limiting Fundamentals',
  setMode: (mode) => set({ mode }),
}));
