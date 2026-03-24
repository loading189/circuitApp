export type SimulationStatus = 'stopped' | 'running' | 'paused';

export interface SimulationSnapshot {
  timestampMs: number;
  nodeVoltages: Record<string, number>;
  supplyCurrentMa: number;
}
