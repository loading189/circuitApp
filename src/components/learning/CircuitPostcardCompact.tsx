import { LESSON_SUPPORT_PROFILES } from '@/features/lessons/lessonSupportProfiles';
import type { LessonDefinition, LessonSupportLevel } from '@/features/lessons/lessonTypes';
import { resolveStepGuidance } from '@/features/lessons/lessonGuidanceEngine';

interface CircuitPostcardCompactProps {
  lesson: LessonDefinition;
  stepIndex: number;
  totalSteps: number;
  supportLevel: LessonSupportLevel;
}

const shouldShowHint = (stepId: string | undefined): boolean =>
  stepId !== 'led-inspect-target' && stepId !== 'led-compare' && stepId !== 'led-complete';

export const CircuitPostcardCompact = ({ lesson, stepIndex, totalSteps, supportLevel }: CircuitPostcardCompactProps): React.JSX.Element => {
  const step = lesson.steps[stepIndex];
  const guidance = resolveStepGuidance(lesson, stepIndex, supportLevel);
  const why = step?.teachingNote ?? step?.expectedOutcome ?? lesson.conceptSummary;
  const hint = supportLevel === 'independent' || !shouldShowHint(step?.id) ? null : guidance;

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-200">{LESSON_SUPPORT_PROFILES[supportLevel].label} lesson</p>
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] text-token-secondary">Current step</p>
        <h3 className="text-sm font-semibold text-token-primary">{step?.actionTitle ?? step?.title ?? 'Lesson complete'}</h3>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] text-token-secondary">Why this step matters</p>
        <p className="text-xs text-token-secondary">{why}</p>
      </div>
      {hint ? (
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-token-secondary">Hint</p>
          <p className="text-xs text-token-secondary">{hint}</p>
        </div>
      ) : null}
      <p className="text-[11px] text-token-secondary">Progress · Step {Math.min(stepIndex + 1, totalSteps)} of {totalSteps}</p>
    </div>
  );
};
