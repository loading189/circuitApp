import type { PlacedComponent } from '@/features/components/componentTypes';
import type { Wire } from '@/features/wiring/wireTypes';
import type { LessonCircuitBlueprint, LessonBlueprintConnection, LessonBlueprintEndpointRef } from './lessonBlueprintTypes';

const resolveEndpointHoleId = (
  endpoint: LessonBlueprintEndpointRef,
  blueprint: LessonCircuitBlueprint,
): string | null => {
  if (endpoint.holeId) {
    return endpoint.holeId;
  }
  if (!endpoint.componentId || !endpoint.terminal) {
    return null;
  }
  const component = blueprint.components.find((item) => item.lessonComponentId === endpoint.componentId);
  return component?.targetPlacement.terminalHoleMap[endpoint.terminal] ?? null;
};

const isConnectionSatisfied = (connection: LessonBlueprintConnection, blueprint: LessonCircuitBlueprint, wires: Wire[]): boolean => {
  const from = resolveEndpointHoleId(connection.from, blueprint);
  const to = resolveEndpointHoleId(connection.to, blueprint);
  if (!from || !to) {
    return false;
  }

  if (connection.kind === 'direct') {
    return from === to;
  }

  return wires.some(
    (wire) =>
      (wire.startHoleId === from && wire.endHoleId === to) ||
      (wire.startHoleId === to && wire.endHoleId === from),
  );
};

export const isBlueprintComponentPlaced = (
  blueprint: LessonCircuitBlueprint,
  componentId: string,
  placedComponents: PlacedComponent[],
): boolean => {
  const target = blueprint.components.find((item) => item.lessonComponentId === componentId);
  if (!target) {
    return false;
  }

  return placedComponents.some((placed) => {
    if (placed.type !== target.componentType) {
      return false;
    }
    return Object.entries(target.targetPlacement.terminalHoleMap).every(([terminalId, holeId]) => {
      const placedTerminal = placed.terminals.find((terminal) => terminal.id === terminalId);
      return placedTerminal?.holeId === holeId;
    });
  });
};

export const isBlueprintConnectionSatisfied = (
  blueprint: LessonCircuitBlueprint,
  connectionId: string,
  wires: Wire[],
): boolean => {
  const connection = blueprint.connections.find((item) => item.id === connectionId);
  if (!connection) {
    return false;
  }
  return isConnectionSatisfied(connection, blueprint, wires);
};

export const isBlueprintTopologySatisfied = (
  blueprint: LessonCircuitBlueprint,
  placedComponents: PlacedComponent[],
  wires: Wire[],
): boolean => {
  const componentsOk = blueprint.components.every((component) =>
    isBlueprintComponentPlaced(blueprint, component.lessonComponentId, placedComponents),
  );
  const connectionsOk = blueprint.connections.every((connection) =>
    isConnectionSatisfied(connection, blueprint, wires),
  );
  return componentsOk && connectionsOk;
};
