import { create } from 'zustand';
import type { Wire, WireColor, WireStyle } from './wireTypes';
import { DEFAULT_WIRE_COLOR } from './wireTypes';

interface WireState {
  wires: Wire[];
  activeColor: WireColor;
  hoveredWireId: string | null;
  wireStartHoleId: string | null;
  wirePreviewHoleId: string | null;
  setActiveColor: (color: WireColor) => void;
  setHoveredWireId: (wireId: string | null) => void;
  startWireAt: (holeId: string) => void;
  previewWireTo: (holeId: string | null) => void;
  cancelWire: () => void;
  addWire: (startHoleId: string, endHoleId: string, color?: WireColor, style?: WireStyle) => void;
  completeWireTo: (endHoleId: string) => void;
  deleteWire: (wireId: string) => void;
  updateWireColor: (wireId: string, color: WireColor) => void;
}

export const useWireStore = create<WireState>((set, get) => ({
  wires: [],
  activeColor: DEFAULT_WIRE_COLOR,
  hoveredWireId: null,
  wireStartHoleId: null,
  wirePreviewHoleId: null,
  setActiveColor: (activeColor) => set({ activeColor }),
  setHoveredWireId: (hoveredWireId) => set({ hoveredWireId }),
  startWireAt: (wireStartHoleId) => set({ wireStartHoleId, wirePreviewHoleId: null }),
  previewWireTo: (wirePreviewHoleId) => set({ wirePreviewHoleId }),
  cancelWire: () => set({ wireStartHoleId: null, wirePreviewHoleId: null }),
  addWire: (startHoleId, endHoleId, color = get().activeColor, style = 'jumper-curved') => {
    if (startHoleId === endHoleId) {
      return;
    }

    set((state) => ({
      wires: [
        ...state.wires,
        {
          id: crypto.randomUUID(),
          startHoleId,
          endHoleId,
          color,
          style,
        },
      ],
    }));
  },
  completeWireTo: (endHoleId) => {
    const { wireStartHoleId } = get();
    if (!wireStartHoleId || wireStartHoleId === endHoleId) {
      set({ wireStartHoleId: null, wirePreviewHoleId: null });
      return;
    }

    get().addWire(wireStartHoleId, endHoleId);
    set({ wireStartHoleId: null, wirePreviewHoleId: null });
  },
  deleteWire: (wireId) => set((state) => ({ wires: state.wires.filter((wire) => wire.id !== wireId) })),
  updateWireColor: (wireId, color) =>
    set((state) => ({
      wires: state.wires.map((wire) => (wire.id === wireId ? { ...wire, color } : wire)),
    })),
}));
