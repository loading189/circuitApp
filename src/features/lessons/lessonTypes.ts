import type { LessonCircuitBlueprint, LessonInspectTargetCircuitPayload, LessonStepBlueprintTarget } from './lessonBlueprintTypes';

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type LessonSupportLevel = 'sandbox' | 'guided' | 'coached' | 'independent';

export type LessonTrack =
  | 'foundations'
  | 'current-and-resistance'
  | 'voltage-and-division'
  | 'time-and-capacitance'
  | 'diodes-and-polarity'
  | 'transistors-and-switching'
  | 'analog-building-blocks'
  | 'digital-logic'
  | 'measurement-and-debugging'
  | 'power-and-regulation';

export type LessonStepType =
  | 'intro'
  | 'place_component'
  | 'wire_connection'
  | 'inspect_target_circuit'
  | 'place_wire'
  | 'run_flow'
  | 'probe_target'
  | 'compare_state'
  | 'configure_component'
  | 'run_simulation'
  | 'probe_node'
  | 'observe_behavior'
  | 'break_circuit'
  | 'inspect_diagnostic'
  | 'explain'
  | 'complete';

export type LessonOverlayTargetType =
  | 'component-library-item'
  | 'breadboard-hole'
  | 'breadboard-zone'
  | 'wire-start'
  | 'wire-end'
  | 'node'
  | 'component-on-board'
  | 'panel-control'
  | 'tool-button';

export interface LessonOverlayTarget {
  id: string;
  type: LessonOverlayTargetType;
  label?: string;
  componentType?: string;
  holeId?: string;
  holeIds?: string[];
  zone?: {
    fromHoleId: string;
    toHoleId: string;
  };
  panelControlId?: string;
  toolButtonId?: string;
}

export interface LessonStepGuidance {
  guided?: string;
  coached?: string;
  independent?: string;
}

export interface LessonStep {
  actionType?:
    | 'inspect_target_circuit'
    | 'place_component'
    | 'place_wire'
    | 'configure_component'
    | 'run_flow'
    | 'probe_target'
    | 'break_circuit'
    | 'compare_state'
    | 'complete';
  id: string;
  type: LessonStepType;
  title: string;
  actionTitle?: string;
  guidance: string;
  successCondition?: string;
  primaryHighlightTargetId?: string;
  secondaryHintTargetId?: string;
  teachingNote?: string;
  afterStepTeachingNote?: string;
  toolSuggestion?: string;
  expectedOutcome?: string;
  observationHint?: string;
  supportGuidance?: LessonStepGuidance;
  overlayTargets?: LessonOverlayTarget[];
  blueprintTargets?: LessonStepBlueprintTarget;
  inspectTargetCircuit?: LessonInspectTargetCircuitPayload;
}

export interface LessonExperiment {
  id: string;
  title: string;
  prompt: string;
  expectedLearning: string;
}

export type LessonCheckpointType =
  | 'components_placed'
  | 'topology_connected'
  | 'simulation_run'
  | 'node_probed'
  | 'break_experiment'
  | 'explanation_acknowledged';

export interface LessonCheckpoint {
  id: string;
  type: LessonCheckpointType;
  label: string;
  description: string;
}

export interface LessonDefinition {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  conceptTitle: string;
  conceptSummary: string;
  track: LessonTrack;
  difficulty: LessonDifficulty;
  estimatedMinutes: number;
  requiredComponents: string[];
  optionalComponents: string[];
  recommendedStartingBoardState: string;
  learningObjectives: string[];
  buildGoal: string;
  steps: LessonStep[];
  observations: string[];
  breakExperiments: LessonExperiment[];
  explanationPrompts: string[];
  commonMistakes: string[];
  checkpoints: LessonCheckpoint[];
  tutorPromptHints: string[];
  tags: string[];
  relatedComponents: string[];
  professionalToolRecommendations: string[];
  blueprint?: LessonCircuitBlueprint;
}
