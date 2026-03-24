import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useSelectionStore } from '@/features/board/selectionStore';

export const InspectorPanel = (): JSX.Element => {
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);
  const component = useComponentPlacementStore((state) =>
    state.components.find((candidate) => candidate.id === selectedComponentId),
  );
  const rotate = useComponentPlacementStore((state) => state.rotateSelectedComponent);
  const del = useComponentPlacementStore((state) => state.deleteComponent);

  return (
    <section className="rounded-lg border border-slate-800 bg-bench-900/80 p-3">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Inspector</h3>
      {!component ? (
        <p className="text-xs text-slate-400">Select a component to inspect properties.</p>
      ) : (
        <div className="space-y-2 text-sm">
          <p className="font-medium text-slate-100">{component.type}</p>
          <p className="text-xs text-slate-400">Terminals: {component.terminals.map((t) => t.holeId).join(' · ')}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => rotate(component.id)}
              className="rounded border border-slate-700 px-2 py-1 text-xs hover:border-cyan-400"
            >
              Rotate
            </button>
            <button
              type="button"
              onClick={() => del(component.id)}
              className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300 hover:border-rose-400"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
