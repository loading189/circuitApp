import { create } from 'zustand';
import { breadboardModel } from './breadboardModel';
import type { ViewportState } from './boardTypes';

interface BoardState {
  hoveredHoleId: string | null;
  selectedHoleId: string | null;
  viewport: ViewportState;
  setHoveredHole: (holeId: string | null) => void;
  setSelectedHole: (holeId: string | null) => void;
  zoomBy: (delta: number) => void;
  panBy: (dx: number, dy: number) => void;
  resetViewport: () => void;
}

const defaultViewport: ViewportState = {
  zoom: 1,
  panX: 0,
  panY: 0,
};

export const useBoardStore = create<BoardState>((set) => ({
  hoveredHoleId: null,
  selectedHoleId: null,
  viewport: defaultViewport,
  setHoveredHole: (holeId) => set({ hoveredHoleId: holeId }),
  setSelectedHole: (holeId) => set({ selectedHoleId: holeId }),
  zoomBy: (delta) =>
    set((state) => {
      const zoom = Math.min(2.5, Math.max(0.5, state.viewport.zoom + delta));
      return { viewport: { ...state.viewport, zoom } };
    }),
  panBy: (dx, dy) =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        panX: state.viewport.panX + dx,
        panY: state.viewport.panY + dy,
      },
    })),
  resetViewport: () => set({ viewport: defaultViewport }),
}));

export const getBoardGeometry = () => breadboardModel;
