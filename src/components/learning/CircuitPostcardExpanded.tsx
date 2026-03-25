import type { LessonProgressSummary } from '@/features/lessons/lessonProgress';
import type { LessonDefinition, LessonSupportLevel } from '@/features/lessons/lessonTypes';
import { TargetCircuitPreview } from './TargetCircuitPreview';

interface CircuitPostcardExpandedProps {
  lesson: LessonDefinition;
  stepIndex: number;
  progress: LessonProgressSummary;
  expanded: boolean;
  supportLevel: LessonSupportLevel;
  guidance: string;
}

export const CircuitPostcardExpanded = ({ lesson, stepIndex, progress, expanded, supportLevel, guidance }: CircuitPostcardExpandedProps): React.JSX.Element => {
  const step = lesson.steps[stepIndex];
  const observe = step?.observationHint ?? lesson.observations[stepIndex % lesson.observations.length] ?? lesson.observations[0];
  const stepOrdinal = `${Math.min(stepIndex + 1, lesson.steps.length)}/${lesson.steps.length}`;
  const isBreakCompareStep = step?.id === 'led-break' || step?.id === 'led-compare';

  return (
    <div className="mt-3 space-y-3 text-xs">
      {expanded ? (
        <>
          <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-2">
            <p className="text-[10px] uppercase tracking-[0.1em] text-cyan-200">Current step · {stepOrdinal}</p>
            <p className="mt-1 text-sm font-semibold text-token-primary">{step?.title ?? 'Lesson complete'}</p>
            <p className="mt-1 text-token-secondary">{guidance}</p>
          </div>

          {step?.inspectTargetCircuit ? <TargetCircuitPreview payload={step.inspectTargetCircuit} /> : null}

          {step?.id === 'led-run' || isBreakCompareStep ? (
            <div className="rounded-lg border border-violet-400/25 bg-violet-500/10 p-2">
              <p className="text-[10px] uppercase tracking-[0.1em] text-violet-100">Compare with flow</p>
              <p className="mt-1 text-token-secondary">{observe}</p>
            </div>
          ) : null}

          {supportLevel !== 'independent' ? (
            <p><span className="text-token-secondary">Common pitfall:</span> {lesson.commonMistakes[stepIndex % lesson.commonMistakes.length] ?? lesson.commonMistakes[0]}</p>
          ) : null}

          <p><span className="text-token-secondary">Build goal:</span> {lesson.buildGoal}</p>
          <p><span className="text-token-secondary">Checkpoints:</span> {progress.completedCount}/{progress.totalCount}</p>
        </>
      ) : (
        <div className="rounded-lg border border-token-soft bg-token-elevated/60 p-2 text-[11px] text-token-secondary">
          Expanded details are hidden. Focus on this step, complete it, then let the next target appear.
        </div>
      )}
    </div>
  );
};
