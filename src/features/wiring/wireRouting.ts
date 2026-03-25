import type { BreadboardHole } from '../board/boardTypes';

export const routeWirePath = (from: BreadboardHole, to: BreadboardHole): string => {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} C ${midX} ${from.y - 24}, ${midX} ${to.y - 24}, ${to.x} ${to.y}`;
};
