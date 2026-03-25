import type { CircuitGraph } from './graphTypes';
import { resolveBreadboardNets } from './resolveBreadboardNets';
import type { Wire } from '../wiring/wireTypes';

export const buildCircuitGraph = (wires: Wire[]): CircuitGraph => {
  const nets = resolveBreadboardNets(wires);
  return {
    nodes: Object.entries(nets).map(([id, memberHoleIds]) => ({ id, memberHoleIds })),
  };
};
