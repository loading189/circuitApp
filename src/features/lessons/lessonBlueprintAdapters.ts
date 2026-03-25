import type { LessonOverlayTarget } from './lessonTypes';
import type { LessonCircuitBlueprint, LessonStepBlueprintTarget } from './lessonBlueprintTypes';

const endpointToHole = (blueprint: LessonCircuitBlueprint, endpoint: { componentId?: string; terminal?: string; holeId?: string }): string | null => {
  if (endpoint.holeId) {
    return endpoint.holeId;
  }
  if (!endpoint.componentId || !endpoint.terminal) {
    return null;
  }
  const component = blueprint.components.find((item) => item.lessonComponentId === endpoint.componentId);
  return component?.targetPlacement.terminalHoleMap[endpoint.terminal] ?? null;
};

export const buildOverlayTargetsFromBlueprint = (
  blueprint: LessonCircuitBlueprint,
  targets?: LessonStepBlueprintTarget,
): LessonOverlayTarget[] => {
  if (!targets) {
    return [];
  }

  const output: LessonOverlayTarget[] = [];

  for (const componentId of targets.componentIds ?? []) {
    const component = blueprint.components.find((item) => item.lessonComponentId === componentId);
    if (!component) {
      continue;
    }

    output.push({
      id: `bp-lib-${component.lessonComponentId}`,
      type: 'component-library-item',
      componentType: component.componentType,
      label: `Place ${component.label ?? component.componentType}`,
    });

    for (const [terminalId, holeId] of Object.entries(component.targetPlacement.terminalHoleMap)) {
      output.push({
        id: `bp-hole-${component.lessonComponentId}-${terminalId}`,
        type: 'breadboard-hole',
        holeId,
        label: `${component.label ?? component.componentType} ${terminalId}`,
      });
    }
  }

  for (const connectionId of targets.connectionIds ?? []) {
    const connection = blueprint.connections.find((item) => item.id === connectionId);
    if (!connection) {
      continue;
    }
    const fromHole = endpointToHole(blueprint, connection.from);
    const toHole = endpointToHole(blueprint, connection.to);
    if (!fromHole || !toHole) {
      continue;
    }

    output.push({ id: `bp-wire-start-${connection.id}`, type: 'wire-start', holeId: fromHole, label: `Start ${connection.label ?? 'wire'}` });
    output.push({ id: `bp-wire-end-${connection.id}`, type: 'wire-end', holeId: toHole, label: `End ${connection.label ?? 'wire'}` });
  }

  for (const breakTargetId of targets.breakTargetIds ?? []) {
    const breakTarget = blueprint.breakTargets?.find((item) => item.id === breakTargetId);
    if (!breakTarget) {
      continue;
    }
    if (breakTarget.type === 'reverse_component' && breakTarget.targetRef.componentId) {
      const component = blueprint.components.find((item) => item.lessonComponentId === breakTarget.targetRef.componentId);
      if (!component) {
        continue;
      }
      const holeIds = Object.values(component.targetPlacement.terminalHoleMap);
      if (holeIds[0] && holeIds[1]) {
        output.push({
          id: `bp-break-${breakTarget.id}`,
          type: 'breadboard-zone',
          zone: { fromHoleId: holeIds[0], toHoleId: holeIds[1] },
          label: breakTarget.label ?? 'Break target',
        });
      }
    }
  }

  return output;
};
