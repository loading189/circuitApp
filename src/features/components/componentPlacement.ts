import { create } from 'zustand';
import { createComponent } from './componentFactory';
import type { ComponentType, PlacedComponent } from './componentTypes';
import { breadboardModel } from '../board/breadboardModel';
import { DEFAULT_RESISTOR_OHMS } from './resistorPresets';

interface ComponentPlacementState {
  placingType: ComponentType | null;
  components: PlacedComponent[];
  resistorPlacementOhms: number;
  setPlacingType: (type: ComponentType | null) => void;
  setResistorPlacementOhms: (ohms: number) => void;
  setResistorValue: (componentId: string, ohms: number) => void;
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

  const sibling = breadboardModel.holes.find((candidate) => candidate.zone === hole.zone && candidate.row === hole.row + 1 && candidate.column === hole.column);
  return sibling?.id ?? holeId;
};

const findNearestHoleId = (x: number, y: number): string | null => {
  let winner: { id: string; distance: number } | null = null;

  for (const hole of breadboardModel.holes) {
    const distance = Math.hypot(hole.x - x, hole.y - y);
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

    const rotatedX = anchor.x - (hole.y - anchor.y);
    const rotatedY = anchor.y + (hole.x - anchor.x);
    const snappedHoleId = findNearestHoleId(rotatedX, rotatedY);
    return snappedHoleId ? { ...terminal, holeId: snappedHoleId } : terminal;
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
  resistorPlacementOhms: DEFAULT_RESISTOR_OHMS,
  setPlacingType: (placingType) => set({ placingType }),
  setResistorPlacementOhms: (ohms) => set({ resistorPlacementOhms: Math.max(1, Math.round(ohms)) }),
  setResistorValue: (componentId, ohms) =>
    set((state) => ({
      resistorPlacementOhms: Math.max(1, Math.round(ohms)),
      components: state.components.map((component) =>
        component.id === componentId && component.type === 'resistor'
          ? { ...component, props: { ...component.props, resistanceOhms: Math.max(1, Math.round(ohms)) } }
          : component,
      ),
    })),
  placeComponentAt: (holeId) => {
    const { placingType, resistorPlacementOhms } = get();
    if (!placingType || !breadboardModel.holesById[holeId]) {
      return;
    }

    const twoTerminal = placingType !== 'ground';
    const component = createComponent(placingType, holeId, twoTerminal ? nextHoleInRow(holeId) : undefined);
    const resolved = component.type === 'resistor' ? { ...component, props: { ...component.props, resistanceOhms: resistorPlacementOhms } } : component;
    set((state) => ({ components: [...state.components, resolved] }));
  },
  rotateSelectedComponent: (componentId) =>
    set((state) => ({ components: state.components.map((component) => (component.id === componentId ? rotateTerminals(component) : component)) })),
  deleteComponent: (componentId) => set((state) => ({ components: state.components.filter((component) => component.id !== componentId) })),
  moveComponentTerminal: (componentId, terminalId, holeId) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === componentId
          ? { ...component, terminals: component.terminals.map((terminal) => (terminal.id === terminalId ? { ...terminal, holeId } : terminal)) }
          : component,
      ),
    })),
  moveComponentToHoles: (componentId, holeIds) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === componentId
          ? { ...component, terminals: component.terminals.map((terminal, index) => ({ ...terminal, holeId: holeIds[index] ?? terminal.holeId })) }
          : component,
      ),
    })),
}));
