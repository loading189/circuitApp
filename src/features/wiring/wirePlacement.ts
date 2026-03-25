import { create } from 'zustand';
import type { Wire } from './wireTypes';

interface WireState {
  wires: Wire[];
  addWire: (fromHoleId: string, toHoleId: string, color?: string) => void;
  deleteWire: (wireId: string) => void;
}

export const useWireStore = create<WireState>((set) => ({
  wires: [],
  addWire: (fromHoleId, toHoleId, color = '#38bdf8') =>
    set((state) => ({
      wires: [
        ...state.wires,
        {
          id: crypto.randomUUID(),
          fromHoleId,
          toHoleId,
          color,
        },
      ],
    })),
  deleteWire: (wireId) => set((state) => ({ wires: state.wires.filter((wire) => wire.id !== wireId) })),
}));
