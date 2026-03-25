export interface CircuitNode {
  id: string;
  memberHoleIds: string[];
}

export interface CircuitGraph {
  nodes: CircuitNode[];
}
