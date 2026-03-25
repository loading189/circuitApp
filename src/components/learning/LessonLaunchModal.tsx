import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { LESSON_LAUNCH_LEVELS, LESSON_SUPPORT_PROFILES } from '@/features/lessons/lessonSupportProfiles';
import { useLessonStore } from '@/features/lessons/lessonStore';

export const LessonLaunchModal = (): React.JSX.Element | null => {
  const open = useLessonStore((state) => state.launchLessonSelectorOpen);
  const lessonId = useLessonStore((state) => state.activeLessonId);
  const activateLesson = useLessonStore((state) => state.activateLesson);
  const closeLessonLaunch = useLessonStore((state) => state.closeLessonLaunch);

  const lesson = lessonRegistry.getById(lessonId ?? '');
  if (!open || !lesson) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <section className="w-[720px] rounded-2xl border border-cyan-400/30 bg-[#080f1f] p-5 shadow-[0_0_40px_rgba(0,255,255,0.15)]">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-300">Launch lesson</p>
            <h2 className="text-lg font-semibold text-slate-100">{lesson.title}</h2>
            <p className="text-xs text-slate-400">{lesson.conceptSummary}</p>
            <p className="mt-1 text-xs text-slate-500">{lesson.estimatedMinutes} min · parts: {lesson.requiredComponents.join(' · ')}</p>
          </div>
          <button type="button" className="chip-btn" onClick={closeLessonLaunch}>Close</button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {LESSON_LAUNCH_LEVELS.map((level) => {
            const profile = LESSON_SUPPORT_PROFILES[level];
            return (
              <button
                key={level}
                type="button"
                onClick={() => activateLesson(lesson.id, level)}
                className="rounded-xl border border-token-soft bg-token-elevated/70 p-3 text-left transition hover:border-cyan-400/70 hover:shadow-glow-subtle"
              >
                <p className="text-[10px] uppercase tracking-[0.12em] text-cyan-300">{profile.difficultyLabel}</p>
                <h3 className="text-sm font-semibold text-token-primary">{profile.label}</h3>
                <p className="mt-1 text-xs text-token-secondary">{profile.description}</p>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  {profile.launchHighlights.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
