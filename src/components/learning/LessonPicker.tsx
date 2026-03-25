import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { useLessonStore } from '@/features/lessons/lessonStore';

export const LessonPicker = (): React.JSX.Element => {
  const activeLessonId = useLessonStore((state) => state.activeLessonId);
  const openLessonLaunch = useLessonStore((state) => state.openLessonLaunch);
  const activateLesson = useLessonStore((state) => state.activateLesson);

  return (
    <section className="mt-2 rounded-lg border border-token-soft bg-token-elevated/60 p-2">
      <p className="panel-title mb-1">Lesson Verse</p>
      <select
        className="w-full rounded border border-token-soft bg-token-elevated px-2 py-1 text-xs"
        value={activeLessonId ?? ''}
        onChange={(event) => openLessonLaunch(event.target.value)}
      >
        {lessonRegistry.all.map((lesson) => (
          <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
        ))}
      </select>
      <div className="mt-2 flex gap-1">
        <button type="button" className="chip-btn" onClick={() => openLessonLaunch(activeLessonId ?? lessonRegistry.all[0]!.id)}>Start with support…</button>
        <button type="button" className="chip-btn" onClick={() => activateLesson(activeLessonId ?? lessonRegistry.all[0]!.id, 'sandbox')}>Sandbox</button>
      </div>
    </section>
  );
};
