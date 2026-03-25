import { useSimulationStore } from '@/features/simulation/simulationStore';

const ControlButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200"
    onClick={onClick}
  >
    {label}
  </button>
);

export const TopControls = (): React.JSX.Element => {
  const { run, stop, step, reset } = useSimulationStore();

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-bench-900 px-4 py-3">
      <div>
        <h1 className="text-lg font-semibold tracking-wide text-cyan-200">Virtual Electronics Lab</h1>
        <p className="text-xs text-slate-400">Local-first educational breadboard workbench</p>
      </div>
      <div className="flex items-center gap-2">
        <ControlButton label="Run" onClick={run} />
        <ControlButton label="Stop" onClick={stop} />
        <ControlButton label="Step" onClick={step} />
        <ControlButton label="Reset" onClick={reset} />
        <ControlButton label="Save" onClick={() => {}} />
        <ControlButton label="Load" onClick={() => {}} />
      </div>
    </header>
  );
};
