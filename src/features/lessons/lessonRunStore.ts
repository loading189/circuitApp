import { create } from 'zustand';
import { lessonRegistry } from './lessonRegistry';
import { resolveStepOverlayTargets } from './lessonGuidanceEngine';
import type { LessonProgressSummary } from './lessonProgress';
import type { LessonRunSession } from './lessonRunTypes';
import type { LessonSupportLevel } from './lessonTypes';

interface LessonRunState {
  activeRun: LessonRunSession | null;
  launchLessonRun: (lessonId: string, supportLevel: LessonSupportLevel) => void;
  restartRun: (supportLevel?: LessonSupportLevel) => void;
  setSupportLevelForRestart: (supportLevel: LessonSupportLevel) => void;
  setStepIndex: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateProgress: (summary: LessonProgressSummary) => void;
  revealHint: (hintId: string) => void;
}


const buildSession = (
  lessonId: string,
  supportLevel: LessonSupportLevel,
  retryCount: number,
): LessonRunSession => ({
  lessonId,
  supportLevel,
  currentStepIndex: 0,
  completedCheckpoints: [],
  revealedHints: [],
  highlightedTargets: resolveStepOverlayTargets(lessonRegistry.getById(lessonId)!, 0, supportLevel),
  runStatus: 'in_progress',
  lessonStartTimestamp: Date.now(),
  progressSummary: {
    completedCheckpointCount: 0,
    totalCheckpointCount: 0,
    completionRatio: 0,
  },
  retryCount,
});

export const useLessonRunStore = create<LessonRunState>((set, get) => ({
  activeRun: null,
  launchLessonRun: (lessonId, supportLevel) => {
    if (!lessonRegistry.getById(lessonId)) {
      return;
    }
    set({ activeRun: buildSession(lessonId, supportLevel, 0) });
  },
  restartRun: (supportLevel) => {
    const run = get().activeRun;
    if (!run) {
      return;
    }
    const nextSupport = supportLevel ?? run.supportLevel;
    set({ activeRun: buildSession(run.lessonId, nextSupport, run.retryCount + 1) });
  },
  setSupportLevelForRestart: (supportLevel) => {
    const run = get().activeRun;
    if (!run) {
      return;
    }
    set({ activeRun: buildSession(run.lessonId, supportLevel, run.retryCount + 1) });
  },
  setStepIndex: (stepIndex) => {
    const run = get().activeRun;
    if (!run) {
      return;
    }
    const lesson = lessonRegistry.getById(run.lessonId);
    if (!lesson) {
      return;
    }
    const bounded = Math.max(0, Math.min(stepIndex, lesson.steps.length - 1));
    set({
      activeRun: {
        ...run,
        currentStepIndex: bounded,
        highlightedTargets: resolveStepOverlayTargets(lesson, bounded, run.supportLevel),
        runStatus: bounded >= lesson.steps.length - 1 ? 'completed' : 'in_progress',
      },
    });
  },
  nextStep: () => {
    const run = get().activeRun;
    if (!run) {
      return;
    }
    get().setStepIndex(run.currentStepIndex + 1);
  },
  previousStep: () => {
    const run = get().activeRun;
    if (!run) {
      return;
    }
    get().setStepIndex(run.currentStepIndex - 1);
  },
  updateProgress: (summary) => {
    const run = get().activeRun;
    if (!run) {
      return;
    }

    const same =
      run.progressSummary.completedCheckpointCount === summary.completedCount &&
      run.progressSummary.totalCheckpointCount === summary.totalCount &&
      run.completedCheckpoints.join('|') === summary.completedCheckpointIds.join('|');

    if (same) {
      return;
    }

    set({
      activeRun: {
        ...run,
        completedCheckpoints: summary.completedCheckpointIds,
        progressSummary: {
          completedCheckpointCount: summary.completedCount,
          totalCheckpointCount: summary.totalCount,
          completionRatio: summary.completionRatio,
        },
      },
    });
  },
  revealHint: (hintId) => {
    const run = get().activeRun;
    if (!run || run.revealedHints.includes(hintId)) {
      return;
    }
    set({ activeRun: { ...run, revealedHints: [...run.revealedHints, hintId] } });
  },
}));

