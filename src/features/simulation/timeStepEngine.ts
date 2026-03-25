import { simulate } from './simulate';
import type { SimulationSnapshot } from './simulationTypes';

export const advanceTimeStep = (snapshot: SimulationSnapshot): SimulationSnapshot => {
  return simulate({ ...snapshot, timestampMs: snapshot.timestampMs + 16 });
};
