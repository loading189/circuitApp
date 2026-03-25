import { BreadboardSvg } from '@/components/breadboard/BreadboardSvg';
import { CircuitPostcard } from '@/components/learning/CircuitPostcard';
import { useSimulationStore } from '@/features/simulation/simulationStore';

export const Workbench = (): JSX.Element => {
  const status = useSimulationStore((state) => state.status);

  return (
    <main className="relative flex h-full flex-1 flex-col p-3">
      <div className={`workbench-shell ${status === 'running' ? 'workbench-shell-live' : ''}`}>
        <BreadboardSvg />
      </div>
      <CircuitPostcard />
    </main>
  );
};
