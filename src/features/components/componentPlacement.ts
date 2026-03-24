import { create } from 'zustand';
import { createComponent } from './componentFactory';
import type { ComponentType, PlacedComponent } from './componentTypes';
import { breadboardModel } from '../board/breadboardModel';

interface ComponentPlacementState {
  placingType: ComponentType | null;
  components: PlacedComponent[];
  setPlacingType: (type: ComponentType | null) => void;
  placeComponentAt: (holeId: string) => void;
  rotateSelectedComponent: (componentId: string) => void;
  deleteComponent: (componentId: string) => void;
  moveComponentTerminal: (componentId: string, terminalId: string, holeId: string) => void;
}

const nextHoleInRow = (holeId: string): string => {
  const hole = breadboardModel.holesById[holeId];
  if (!hole) {
    return holeId;
  }

  const sibling = breadboardModel.holes.find((candidate) => {
    return candidate.zone === hole.zone && candidate.row === hole.row + 1 && candidate.column === hole.column;
  });

  return sibling?.id ?? holeId;
};

export const useComponentPlacementStore = create<ComponentPlacementState>((set, get) => ({
  placingType: null,
  components: [],
  setPlacingType: (placingType) => set({ placingType }),
  placeComponentAt: (holeId) => {
    const { placingType } = get();
    if (!placingType || !breadboardModel.holesById[holeId]) {
      return;
    }

    const twoTerminal = placingType !== 'ground';
    const component = createComponent(placingType, holeId, twoTerminal ? nextHoleInRow(holeId) : undefined);

    set((state) => ({ components: [...state.components, component] }));
  },
  rotateSelectedComponent: (componentId) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === componentId
          ? { ...component, rotation: (((component.rotation + 90) % 360) as 0 | 90 | 180 | 270) }
          : component,
      ),
    })),
  deleteComponent: (componentId) =>
    set((state) => ({
      components: state.components.filter((component) => component.id !== componentId),
    })),
  moveComponentTerminal: (componentId, terminalId, holeId) =>
    set((state) => ({
      components: state.components.map((component) => {
        if (component.id !== componentId) {
          return component;
        }

        return {
          ...component,
          terminals: component.terminals.map((terminal) =>
            terminal.id === terminalId ? { ...terminal, holeId } : terminal,
          ),
        };
      }),
    })),
}));
