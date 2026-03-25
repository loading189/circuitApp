import type { ComponentType } from '@/features/components/componentTypes';

export type LessonBlueprintEndpointRef = {
  componentId?: string;
  terminal?: string;
  holeId?: string;
};

export type LessonBlueprintComponent = {
  lessonComponentId: string;
  componentType: ComponentType;
  label?: string;
  targetPlacement: {
    terminalHoleMap: Record<string, string>;
  };
  properties?: Record<string, unknown>;
};

export type LessonBlueprintConnection = {
  id: string;
  from: LessonBlueprintEndpointRef;
  to: LessonBlueprintEndpointRef;
  kind: 'wire' | 'direct';
  label?: string;
};

export type LessonObservationTarget = {
  id: string;
  type: 'node' | 'component' | 'connection' | 'path';
  targetRef: Record<string, string>;
  label?: string;
};

export type LessonBreakTarget = {
  id: string;
  type: 'reverse_component' | 'remove_connection' | 'change_property' | 'disconnect_path';
  targetRef: Record<string, string>;
  label?: string;
};

export type LessonCircuitBlueprint = {
  id: string;
  title?: string;
  components: LessonBlueprintComponent[];
  connections: LessonBlueprintConnection[];
  observationTargets?: LessonObservationTarget[];
  breakTargets?: LessonBreakTarget[];
};

export type LessonStepBlueprintTarget = {
  componentIds?: string[];
  connectionIds?: string[];
  observationTargetIds?: string[];
  breakTargetIds?: string[];
};

export type LessonInspectTargetCircuitPayload = {
  summary: string;
  pathOrder: string[];
  focusComponentIds?: string[];
};
