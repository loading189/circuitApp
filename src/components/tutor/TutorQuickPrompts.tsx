import { tutorQuickPrompts } from '@/features/tutor/tutorPrompts';
import { useLessonStore } from '@/features/lessons/lessonStore';
import { lessonRegistry } from '@/features/lessons/lessonRegistry';

export const TutorQuickPrompts = ({ onPick }: { onPick: (value: string) => void }): React.JSX.Element => {
  const activeLessonId = useLessonStore((state) => state.activeLessonId);
  const lesson = lessonRegistry.getById(activeLessonId ?? '');
  const prompts = lesson?.tutorPromptHints?.length ? lesson.tutorPromptHints : tutorQuickPrompts;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {prompts.map((prompt) => (
      <button key={prompt} type="button" className="chip-btn" onClick={() => onPick(prompt)}>
        {prompt}
      </button>
      ))}
    </div>
  );
};
