import { DiagnosticsPanel } from '@/components/diagnostics/DiagnosticsPanel';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { InstrumentsPanel } from '@/components/instruments/InstrumentsPanel';

export const RightSidebar = (): JSX.Element => {
  return (
    <aside className="flex h-full w-80 flex-col gap-4 border-l border-slate-800 bg-bench-900/60 p-4">
      <InspectorPanel />
      <DiagnosticsPanel />
      <InstrumentsPanel />
    </aside>
  );
};
