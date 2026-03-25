import { create } from 'zustand';

export interface SamplePoint {
  t: number;
  v: number;
}

interface WaveformState {
  points: SamplePoint[];
  pushPoint: (point: SamplePoint) => void;
  clear: () => void;
}

export const useWaveformStore = create<WaveformState>((set) => ({
  points: [],
  pushPoint: (point) => set((state) => ({ points: [...state.points.slice(-399), point] })),
  clear: () => set({ points: [] }),
}));
