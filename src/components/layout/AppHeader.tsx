import { ModeSwitcher } from './ModeSwitcher';
import { useLabUiStore } from '@/features/ui/labUiStore';
import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { useLessonStore } from '@/features/lessons/lessonStore';
import { useSimulationStore } from '@/features/simulation/simulationStore';

const HeaderButton = ({ label, onClick }: { label: string; onClick: () => void }): React.JSX.Element => (
  <button type="button" className="control-btn" onClick={onClick}>
    {label}
  </button>
);

export const AppHeader = (): React.JSX.Element => {
  const lesson = lessonRegistry.getById(useLessonStore((state) => state.activeLessonId ?? ''))?.title ?? useLabUiStore((state) => state.activeLessonTitle);
  const { run, stop, step, reset, status } = useSimulationStore();

  return (
    <header className={`app-header ${status === 'running' ? 'app-header-live' : ''}`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-8 w-8 rounded-lg border border-cyan-400/50 bg-cyan-400/10 shadow-glow-subtle" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">Virtual Electronics Lab</h1>
          <p className="truncate text-xs text-token-secondary">{lesson}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ModeSwitcher />
        <div className="flex items-center gap-2">
          <HeaderButton label="Run" onClick={run} />
          <HeaderButton label="Stop" onClick={stop} />
          <HeaderButton label="Step" onClick={step} />
          <HeaderButton label="Reset" onClick={reset} />
          <HeaderButton label="Save" onClick={() => {}} />
          <HeaderButton label="Load" onClick={() => {}} />
        </div>
        <div className="status-pill">
          <span className={`h-2 w-2 rounded-full ${status === 'running' ? 'bg-emerald-300 shadow-glow-subtle' : 'bg-slate-500'}`} />
          Tutor Bridge
        </div>
      </div>
    </header>
  );
};
