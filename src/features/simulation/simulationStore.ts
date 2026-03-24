import { create } from 'zustand';
import type { SimulationSnapshot, SimulationStatus } from './simulationTypes';

interface SimulationState {
  status: SimulationStatus;
  snapshot: SimulationSnapshot;
  run: () => void;
  stop: () => void;
  step: () => void;
  reset: () => void;
}

const createInitialSnapshot = (): SimulationSnapshot => ({
  timestampMs: 0,
  nodeVoltages: {},
  supplyCurrentMa: 0,
});

export const useSimulationStore = create<SimulationState>((set) => ({
  status: 'stopped',
  snapshot: createInitialSnapshot(),
  run: () => set({ status: 'running' }),
  stop: () => set({ status: 'paused' }),
  step: () =>
    set((state) => ({
      snapshot: { ...state.snapshot, timestampMs: state.snapshot.timestampMs + 16 },
    })),
  reset: () => set({ status: 'stopped', snapshot: createInitialSnapshot() }),
}));
