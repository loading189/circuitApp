import type { LessonProgressSummary } from '@/features/lessons/lessonProgress';
import type { LessonDefinition, LessonSupportLevel } from '@/features/lessons/lessonTypes';

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
  const activeBreak = lesson.breakExperiments[stepIndex % lesson.breakExperiments.length] ?? lesson.breakExperiments[0];
  const stepOrdinal = `${Math.min(stepIndex + 1, lesson.steps.length)}/${lesson.steps.length}`;

  return (
    <div className="mt-3 space-y-3 text-xs">
      {expanded ? (
        <>
          <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-2">
            <p className="text-[10px] uppercase tracking-[0.1em] text-cyan-200">Current step · {stepOrdinal}</p>
            <p className="mt-1 text-sm font-semibold text-token-primary">{step?.title ?? 'Lesson complete'}</p>
            <p className="mt-1 text-token-secondary">{guidance}</p>
          </div>
          <p><span className="text-token-secondary">Build goal:</span> {lesson.buildGoal}</p>
          <p><span className="text-token-secondary">Required parts:</span> {lesson.requiredComponents.join(' · ')}</p>
          <div className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 p-2">
            <p className="text-[10px] uppercase tracking-[0.1em] text-emerald-200">What to observe</p>
            <p className="mt-1 text-token-secondary">{observe}</p>
          </div>
          {supportLevel !== 'independent' ? (
            <p><span className="text-token-secondary">Common mistake to avoid:</span> {lesson.commonMistakes[stepIndex % lesson.commonMistakes.length] ?? lesson.commonMistakes[0]}</p>
          ) : null}
          {supportLevel === 'guided' ? (
            <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-2">
              <p className="text-[10px] uppercase tracking-[0.1em] text-amber-100">Break-it experiment</p>
              <p className="mt-1 text-token-secondary">{activeBreak?.prompt ?? 'Try one controlled miswire.'}</p>
            </div>
          ) : null}
          <p><span className="text-token-secondary">Checkpoints:</span> {progress.completedCount}/{progress.totalCount}</p>
          <div>
            <p className="text-token-secondary">Objectives</p>
            <ul className="list-disc pl-4">
              {lesson.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-token-secondary">Step map</p>
            <ul className="list-disc pl-4">
              {lesson.steps.map((item, index) => <li key={item.id} className={index === stepIndex ? 'text-cyan-200' : ''}>{item.title}</li>)}
            </ul>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-token-soft bg-token-elevated/60 p-2 text-[11px] text-token-secondary">
          Expanded details are hidden. Focus on the current step and board highlights.
        </div>
      )}
    </div>
  );
};
