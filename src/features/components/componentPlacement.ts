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
  moveComponentToHoles: (componentId: string, holeIds: string[]) => void;
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

const findNearestHoleId = (x: number, y: number): string | null => {
  let winner: { id: string; distance: number } | null = null;

  for (const hole of breadboardModel.holes) {
    const dx = hole.x - x;
    const dy = hole.y - y;
    const distance = Math.hypot(dx, dy);

    if (!winner || distance < winner.distance) {
      winner = { id: hole.id, distance };
    }
  }

  if (!winner || winner.distance > 22) {
    return null;
  }

  return winner.id;
};

const rotateTerminals = (component: PlacedComponent): PlacedComponent => {
  if (!component.terminals.length) {
    return component;
  }

  const anchor = breadboardModel.holesById[component.terminals[0].holeId];
  if (!anchor) {
    return { ...component, rotation: (((component.rotation + 90) % 360) as 0 | 90 | 180 | 270) };
  }

  const nextTerminals = component.terminals.map((terminal, index) => {
    if (index === 0) {
      return terminal;
    }

    const hole = breadboardModel.holesById[terminal.holeId];
    if (!hole) {
      return terminal;
    }

    const relativeX = hole.x - anchor.x;
    const relativeY = hole.y - anchor.y;
    const rotatedX = anchor.x - relativeY;
    const rotatedY = anchor.y + relativeX;

    const snappedHoleId = findNearestHoleId(rotatedX, rotatedY);
    if (!snappedHoleId) {
      return terminal;
    }

    return { ...terminal, holeId: snappedHoleId };
  });

  return {
    ...component,
    terminals: nextTerminals,
    rotation: (((component.rotation + 90) % 360) as 0 | 90 | 180 | 270),
  };
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
      components: state.components.map((component) => (component.id === componentId ? rotateTerminals(component) : component)),
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
  moveComponentToHoles: (componentId, holeIds) =>
    set((state) => ({
      components: state.components.map((component) => {
        if (component.id !== componentId) {
          return component;
        }

        return {
          ...component,
          terminals: component.terminals.map((terminal, index) => ({
            ...terminal,
            holeId: holeIds[index] ?? terminal.holeId,
          })),
        };
      }),
    })),
}));
