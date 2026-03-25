import { LESSON_SUPPORT_PROFILES } from './lessonSupportProfiles';
import type { LessonDefinition, LessonOverlayTarget, LessonSupportLevel } from './lessonTypes';

const isExactTarget = (target: LessonOverlayTarget): boolean =>
  target.type === 'breadboard-hole' || target.type === 'wire-start' || target.type === 'wire-end';

export const resolveStepGuidance = (
  lesson: LessonDefinition,
  stepIndex: number,
  supportLevel: LessonSupportLevel,
): string => {
  const step = lesson.steps[stepIndex];
  if (!step) {
    return 'Lesson complete. Review your observations and replay with less support.';
  }

  if (supportLevel === 'sandbox') {
    return step.guidance;
  }

  return step.supportGuidance?.[supportLevel] ?? step.guidance;
};

export const resolveStepOverlayTargets = (
  lesson: LessonDefinition,
  stepIndex: number,
  supportLevel: LessonSupportLevel,
): LessonOverlayTarget[] => {
  if (supportLevel === 'sandbox' || supportLevel === 'independent') {
    return [];
  }

  const step = lesson.steps[stepIndex];
  if (!step?.overlayTargets?.length) {
    return [];
  }

  if (supportLevel === 'guided') {
    return step.overlayTargets;
  }

  const profile = LESSON_SUPPORT_PROFILES[supportLevel];
  return step.overlayTargets.filter((target) => !profile.showExactPlacement ? !isExactTarget(target) : true);
};
