import { useBoardStore } from '@/features/board/boardStore';
import { getActiveLessonContext } from '@/features/lessons/lessonContextAdapter';
import { useSimulationStore } from '@/features/simulation/simulationStore';

export const InstrumentsPanel = (): React.JSX.Element => {
  const selectedHole = useBoardStore((state) => state.selectedHoleId);
  const snapshot = useSimulationStore((state) => state.snapshot);
  const lessonContext = getActiveLessonContext();

  const nodeVoltage = selectedHole ? snapshot.nodeVoltages[selectedHole] : undefined;

  return (
    <section className="rail-panel">
      <h3 className="panel-title">Instruments</h3>
      <div className="space-y-2 text-xs text-token-secondary">
        <p>Probe node: <span className="text-token-primary">{selectedHole ?? 'none'}</span></p>
        <p>Node voltage: <span className="font-mono text-token-primary">{nodeVoltage !== undefined ? `${nodeVoltage.toFixed(2)} V` : '-- V'}</span></p>
        <p>Supply current: <span className="font-mono text-token-primary">{snapshot.supplyCurrentMa.toFixed(2)} mA</span></p>
        {lessonContext ? <p>Lesson progress: <span className="text-token-primary">{lessonContext.progressLabel}</span></p> : null}
        <div>
          <p className="mb-1 text-token-primary">Trend</p>
          <div className="h-14 rounded-md border border-token-soft bg-[linear-gradient(180deg,rgba(56,189,248,0.15),transparent)]" />
        </div>
      </div>
    </section>
  );
};
