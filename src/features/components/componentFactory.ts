import { componentRegistry } from './componentRegistry';
import type { ComponentTerminal, ComponentType, PlacedComponent } from './componentTypes';

const uid = () => crypto.randomUUID();

const buildTerminals = (holeA: string, holeB: string, templates: Array<{ id: string; label: string; offset: number }>): ComponentTerminal[] => {
  return templates.map((template, index) => ({
    id: template.id,
    label: template.label,
    holeId: index === 0 ? holeA : holeB,
  }));
};

export const createComponent = (type: ComponentType, holeA: string, holeB?: string): PlacedComponent => {
  const definition = componentRegistry.getByType(type);
  const secondHole = holeB ?? holeA;

  return {
    id: uid(),
    type,
    name: definition.shortName,
    rotation: 0,
    terminals: buildTerminals(holeA, secondHole, definition.terminals),
    props: { ...definition.defaultProperties },
  } as PlacedComponent;
};
