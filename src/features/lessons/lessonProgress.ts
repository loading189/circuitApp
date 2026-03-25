import type { PlacedComponent } from '@/features/components/componentTypes';
import type { SimulationStatus } from '@/features/simulation/simulationTypes';
import type { LessonDefinition } from './lessonTypes';

interface LessonProgressInput {
  lesson: LessonDefinition;
  components: PlacedComponent[];
  hasProbeSelection: boolean;
  simulationStatus: SimulationStatus;
  currentStepIndex: number;
}

export interface LessonProgressSummary {
  completedCheckpointIds: string[];
  completedCount: number;
  totalCount: number;
  completionRatio: number;
}

const hasRequiredComponents = (required: string[], placed: PlacedComponent[]): boolean => {
  const requiredCounts = new Map<string, number>();
  const placedCounts = new Map<string, number>();

  required.forEach((type) => requiredCounts.set(type, (requiredCounts.get(type) ?? 0) + 1));
  placed.forEach((component) => placedCounts.set(component.type, (placedCounts.get(component.type) ?? 0) + 1));

  return [...requiredCounts.entries()].every(([type, count]) => (placedCounts.get(type) ?? 0) >= count);
};

export const evaluateLessonProgress = (input: LessonProgressInput): LessonProgressSummary => {
  const completed = new Set<string>();

  for (const checkpoint of input.lesson.checkpoints) {
    if (checkpoint.type === 'components_placed' && hasRequiredComponents(input.lesson.requiredComponents, input.components)) {
      completed.add(checkpoint.id);
    }
    if (checkpoint.type === 'simulation_run' && input.simulationStatus !== 'stopped') {
      completed.add(checkpoint.id);
    }
    if (checkpoint.type === 'node_probed' && input.hasProbeSelection) {
      completed.add(checkpoint.id);
    }
    if (checkpoint.type === 'break_experiment' && input.currentStepIndex > 0 && input.lesson.steps[input.currentStepIndex]?.type !== 'break_circuit') {
      const breakStepIndex = input.lesson.steps.findIndex((step) => step.type === 'break_circuit');
      if (breakStepIndex >= 0 && input.currentStepIndex > breakStepIndex) {
        completed.add(checkpoint.id);
      }
    }
    if (checkpoint.type === 'explanation_acknowledged' && input.lesson.steps[input.currentStepIndex]?.type === 'complete') {
      completed.add(checkpoint.id);
    }
    if (checkpoint.type === 'topology_connected' && hasRequiredComponents(input.lesson.requiredComponents, input.components) && input.simulationStatus !== 'stopped') {
      completed.add(checkpoint.id);
    }
  }

  const total = input.lesson.checkpoints.length;
  const completedCount = completed.size;

  return {
    completedCheckpointIds: [...completed],
    completedCount,
    totalCount: total,
    completionRatio: total === 0 ? 0 : completedCount / total,
  };
};
