import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { useLessonStore } from '@/features/lessons/lessonStore';

export const LessonPicker = (): JSX.Element => {
  const activeLessonId = useLessonStore((state) => state.activeLessonId);
  const activateLesson = useLessonStore((state) => state.activateLesson);

  return (
    <section className="mt-2 rounded-lg border border-token-soft bg-token-elevated/60 p-2">
      <p className="panel-title mb-1">Lesson Verse</p>
      <select
        className="w-full rounded border border-token-soft bg-token-elevated px-2 py-1 text-xs"
        value={activeLessonId ?? ''}
        onChange={(event) => activateLesson(event.target.value)}
      >
        {lessonRegistry.all.map((lesson) => (
          <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
        ))}
      </select>
    </section>
  );
};
