import type { Wire } from '@/features/wiring/wireTypes';
import type { SimulationSnapshot } from '@/features/simulation/simulationTypes';

export type FlowPathState = 'active' | 'inactive' | 'blocked';

export interface FlowWireState {
  wireId: string;
  state: FlowPathState;
  intensity: number;
  forward: boolean;
}

const voltageFor = (snapshot: SimulationSnapshot, holeId: string): number | null => {
  const value = snapshot.nodeVoltages[holeId];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

export const computeFlowWireStates = (wires: Wire[], snapshot: SimulationSnapshot): FlowWireState[] => {
  return wires.map((wire) => {
    const startV = voltageFor(snapshot, wire.startHoleId);
    const endV = voltageFor(snapshot, wire.endHoleId);

    if (startV === null || endV === null) {
      return { wireId: wire.id, state: 'inactive', intensity: 0.35, forward: true };
    }

    const drop = startV - endV;
    const magnitude = Math.abs(drop);

    if (magnitude < 0.05) {
      return { wireId: wire.id, state: 'blocked', intensity: 0.25, forward: true };
    }

    return {
      wireId: wire.id,
      state: 'active',
      intensity: Math.min(1, 0.35 + magnitude / 5),
      forward: drop >= 0,
    };
  });
};
