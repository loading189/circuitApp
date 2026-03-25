import type { LessonProgressSummary } from '@/features/lessons/lessonProgress';
import type { LessonDefinition } from '@/features/lessons/lessonTypes';

interface CircuitPostcardExpandedProps {
  lesson: LessonDefinition;
  stepIndex: number;
  progress: LessonProgressSummary;
  expanded: boolean;
}

export const CircuitPostcardExpanded = ({ lesson, stepIndex, progress, expanded }: CircuitPostcardExpandedProps): React.JSX.Element => {
  const step = lesson.steps[stepIndex];
  const observe = lesson.observations[stepIndex % lesson.observations.length] ?? lesson.observations[0];
  const activeBreak = lesson.breakExperiments[stepIndex % lesson.breakExperiments.length] ?? lesson.breakExperiments[0];

  return (
    <div className="mt-3 space-y-3 text-xs">
      <p><span className="text-token-secondary">Build goal:</span> {lesson.buildGoal}</p>
      <p><span className="text-token-secondary">Current step:</span> {step?.title ?? 'None'} — {step?.guidance}</p>
      <p><span className="text-token-secondary">Required parts:</span> {lesson.requiredComponents.join(' · ')}</p>
      <p><span className="text-token-secondary">What to observe:</span> {observe}</p>
      <p><span className="text-token-secondary">Common mistake:</span> {lesson.commonMistakes[0]}</p>
      <p><span className="text-token-secondary">Break-it now:</span> {activeBreak?.prompt ?? 'Try one controlled miswire.'}</p>
      <p><span className="text-token-secondary">Checkpoints:</span> {progress.completedCount}/{progress.totalCount}</p>

      {expanded ? (
        <>
          <div>
            <p className="text-token-secondary">Objectives</p>
            <ul className="list-disc pl-4">
              {lesson.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-token-secondary">Step list</p>
            <ul className="list-disc pl-4">
              {lesson.steps.map((item, index) => <li key={item.id} className={index === stepIndex ? 'text-cyan-200' : ''}>{item.title}</li>)}
            </ul>
          </div>
          {lesson.breakExperiments.length ? (
            <div>
              <p className="text-token-secondary">Break-it experiments</p>
              <ul className="list-disc pl-4">
                {lesson.breakExperiments.map((experiment) => <li key={experiment.id}>{experiment.title}</li>)}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
