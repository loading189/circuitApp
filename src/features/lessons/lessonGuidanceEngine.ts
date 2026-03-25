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

  const primaryTarget =
    step.overlayTargets.find((target) => target.id === step.primaryHighlightTargetId) ?? step.overlayTargets[0] ?? null;
  const secondaryTarget = step.overlayTargets.find((target) => target.id === step.secondaryHintTargetId) ?? null;

  if (!primaryTarget) {
    return [];
  }

  if (supportLevel === 'guided') {
    return secondaryTarget ? [primaryTarget, secondaryTarget] : [primaryTarget];
  }

  const profile = LESSON_SUPPORT_PROFILES[supportLevel];
  if (!profile.showExactPlacement && isExactTarget(primaryTarget)) {
    return secondaryTarget && !isExactTarget(secondaryTarget) ? [secondaryTarget] : [];
  }
  return [primaryTarget];
};
