import type { LessonSupportLevel, LessonOverlayTarget } from './lessonTypes';

export type LessonRunStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonRunSummary {
  completedCheckpointCount: number;
  totalCheckpointCount: number;
  completionRatio: number;
}

export interface LessonRunSession {
  lessonId: string;
  supportLevel: LessonSupportLevel;
  currentStepIndex: number;
  completedCheckpoints: string[];
  revealedHints: string[];
  highlightedTargets: LessonOverlayTarget[];
  runStatus: LessonRunStatus;
  lessonStartTimestamp: number;
  progressSummary: LessonRunSummary;
  retryCount: number;
}
