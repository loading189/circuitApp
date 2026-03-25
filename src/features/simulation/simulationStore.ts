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

const stepSnapshot = (snapshot: SimulationSnapshot): SimulationSnapshot => {
  const nextTime = snapshot.timestampMs + 16;
  const phase = Math.sin(nextTime / 220);
  return {
    timestampMs: nextTime,
    nodeVoltages: {
      ...snapshot.nodeVoltages,
      'B-12': 1.6 + phase * 0.12,
      'B-13': 3.2 + phase * 0.18,
    },
    supplyCurrentMa: 8.4 + phase * 0.9,
  };
};

export const useSimulationStore = create<SimulationState>((set) => ({
  status: 'stopped',
  snapshot: createInitialSnapshot(),
  run: () => set({ status: 'running' }),
  stop: () => set({ status: 'paused' }),
  step: () => set((state) => ({ snapshot: stepSnapshot(state.snapshot) })),
  reset: () => set({ status: 'stopped', snapshot: createInitialSnapshot() }),
}));
