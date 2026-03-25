import { breadboardModel } from '../board/breadboardModel';
import type { Wire } from '../wiring/wireTypes';

class UnionFind {
  private readonly parent = new Map<string, string>();

  find(node: string): string {
    const current = this.parent.get(node) ?? node;
    if (current !== node) {
      const root = this.find(current);
      this.parent.set(node, root);
      return root;
    }
    this.parent.set(node, node);
    return node;
  }

  union(a: string, b: string): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent.set(rootA, rootB);
    }
  }
}

export const resolveBreadboardNets = (wires: Wire[] = []): Record<string, string[]> => {
  const uf = new UnionFind();

  for (const stripMembers of Object.values(breadboardModel.stripsByDefaultNet)) {
    const first = stripMembers[0];
    if (!first) {
      continue;
    }
    for (let i = 1; i < stripMembers.length; i += 1) {
      const next = stripMembers[i];
      if (next) {
        uf.union(first, next);
      }
    }
  }

  for (const wire of wires) {
    uf.union(wire.startHoleId, wire.endHoleId);
  }

  return breadboardModel.holes.reduce<Record<string, string[]>>((acc, hole) => {
    const root = uf.find(hole.id);
    acc[root] ??= [];
    acc[root].push(hole.id);
    return acc;
  }, {});
};
