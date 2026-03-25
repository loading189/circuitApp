import { useBoardStore } from '@/features/board/boardStore';

export const InstrumentsPanel = (): JSX.Element => {
  const selectedHole = useBoardStore((state) => state.selectedHoleId);

  return (
    <section className="rounded-lg border border-slate-800 bg-bench-900/80 p-3">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Instruments</h3>
      <div className="space-y-2 text-xs text-slate-300">
        <p>Probe node: {selectedHole ?? 'none'}</p>
        <p>Node voltage: -- V (simulation in Phase 6)</p>
        <p>Supply current: -- mA</p>
      </div>
    </section>
  );
};
