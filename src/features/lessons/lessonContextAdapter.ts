import { useBoardStore } from '@/features/board/boardStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import { lessonRegistry } from './lessonRegistry';
import type { LessonSupportLevel } from './lessonTypes';
import { resolveStepGuidance } from './lessonGuidanceEngine';
import { evaluateLessonProgress } from './lessonProgress';
import { useLessonStore } from './lessonStore';

export interface ActiveLessonContext {
  supportLevel: LessonSupportLevel;
  lessonId: string;
  lessonTitle: string;
  conceptTitle: string;
  currentStepLabel: string;
  requiredComponents: string[];
  expectedObservations: string[];
  commonMistakes: string[];
  progressLabel: string;
}

export const getActiveLessonContext = (): ActiveLessonContext | null => {
  const lessonId = useLessonStore.getState().activeLessonId;
  if (!lessonId) {
    return null;
  }

  const lesson = lessonRegistry.getById(lessonId);
  if (!lesson) {
    return null;
  }

  const lessonState = useLessonStore.getState();
  const stepIndex = lessonState.activeStepIndex;
  const components = useComponentPlacementStore.getState().components;
  const selectedHoleId = useBoardStore.getState().selectedHoleId;
  const simulationStatus = useSimulationStore.getState().status;

  const progress = evaluateLessonProgress({
    lesson,
    components,
    hasProbeSelection: Boolean(selectedHoleId),
    simulationStatus,
    currentStepIndex: stepIndex,
  });

  return {
    lessonId: lesson.id,
    supportLevel: lessonState.activeSupportLevel,
    lessonTitle: lesson.title,
    conceptTitle: lesson.conceptTitle,
    currentStepLabel: `${lesson.steps[stepIndex]?.title ?? 'No step selected'} — ${resolveStepGuidance(lesson, stepIndex, lessonState.activeSupportLevel)}`,
    requiredComponents: lesson.requiredComponents,
    expectedObservations: lesson.observations,
    commonMistakes: lesson.commonMistakes,
    progressLabel: `${progress.completedCount}/${progress.totalCount} checkpoints`,
  };
};
