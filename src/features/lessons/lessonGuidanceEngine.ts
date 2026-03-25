import { LESSON_SUPPORT_PROFILES } from './lessonSupportProfiles';
import { buildOverlayTargetsFromBlueprint } from './lessonBlueprintAdapters';
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
  if (!step) {
    return [];
  }

  const blueprintTargets = lesson.blueprint
    ? buildOverlayTargetsFromBlueprint(lesson.blueprint, step.blueprintTargets)
    : [];
  const candidateTargets = blueprintTargets.length ? blueprintTargets : (step.overlayTargets ?? []);

  if (!candidateTargets.length) {
    return [];
  }

  const primaryTarget =
    candidateTargets.find((target) => target.id === step.primaryHighlightTargetId) ?? candidateTargets[0] ?? null;
  const secondaryTarget = candidateTargets.find((target) => target.id === step.secondaryHintTargetId) ?? candidateTargets[1] ?? null;

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
