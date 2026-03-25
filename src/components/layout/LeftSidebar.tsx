import { ComponentLibrary } from '@/components/parts/ComponentLibrary';
import { LessonPicker } from '@/components/learning/LessonPicker';
import { LessonPartsPanel } from '@/components/learning/LessonPartsPanel';
import { useLessonStore } from '@/features/lessons/lessonStore';

export const LeftSidebar = (): React.JSX.Element => {
  const activeSupportLevel = useLessonStore((state) => state.activeSupportLevel);
  const libraryMode = useLessonStore((state) => state.libraryMode);
  const isLessonFocused = activeSupportLevel !== 'sandbox';

  return (
    <aside className="panel-shell w-[300px] p-3">
      <section>
        <h2 className="panel-title">{isLessonFocused ? 'Lesson Bench' : 'Tooling'}</h2>
        <p className="text-xs text-token-secondary">
          {isLessonFocused
            ? 'Step-first workspace. Keep focus on required parts and current action.'
            : 'Use the on-canvas tool bar for Select, Wire, Probe, Pan, and Reset View.'}
        </p>
      </section>
      <LessonPicker />
      {isLessonFocused && libraryMode !== 'full' ? <LessonPartsPanel /> : <ComponentLibrary />}
    </aside>
  );
};
