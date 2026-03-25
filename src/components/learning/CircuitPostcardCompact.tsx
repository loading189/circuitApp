import { LESSON_SUPPORT_PROFILES } from '@/features/lessons/lessonSupportProfiles';
import type { LessonDefinition, LessonSupportLevel } from '@/features/lessons/lessonTypes';

interface CircuitPostcardCompactProps {
  lesson: LessonDefinition;
  stepIndex: number;
  totalSteps: number;
  supportLevel: LessonSupportLevel;
}

export const CircuitPostcardCompact = ({ lesson, stepIndex, totalSteps, supportLevel }: CircuitPostcardCompactProps): React.JSX.Element => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-200">{lesson.conceptTitle}</p>
    <h3 className="text-sm font-semibold text-token-primary">{lesson.title}</h3>
    <p className="mt-1 text-xs text-token-secondary">{lesson.conceptSummary}</p>
    <p className="mt-1 text-[11px] text-token-secondary">Step {Math.min(stepIndex + 1, totalSteps)}/{totalSteps} · {lesson.estimatedMinutes} min · {LESSON_SUPPORT_PROFILES[supportLevel].label}</p>
  </div>
);
