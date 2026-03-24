export const DiagnosticsPanel = (): JSX.Element => {
  return (
    <section className="rounded-lg border border-slate-800 bg-bench-900/80 p-3">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Diagnostics</h3>
      <ul className="space-y-2 text-xs text-slate-300">
        <li className="rounded border border-emerald-800/60 bg-emerald-500/10 p-2">info · Ready for component placement.</li>
        <li className="rounded border border-slate-700 p-2 text-slate-400">Simulation diagnostics will appear here in Phase 6+.</li>
      </ul>
    </section>
  );
};
