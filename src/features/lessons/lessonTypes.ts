export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type LessonStepType =
  | 'intro'
  | 'place_component'
  | 'wire_connection'
  | 'configure_component'
  | 'run_simulation'
  | 'probe_node'
  | 'observe_behavior'
  | 'break_circuit'
  | 'inspect_diagnostic'
  | 'explain'
  | 'complete';

export interface LessonStep {
  id: string;
  type: LessonStepType;
  title: string;
  guidance: string;
  expectedOutcome?: string;
  observationHint?: string;
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
}
