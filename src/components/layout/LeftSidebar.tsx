import { ComponentLibrary } from '@/components/parts/ComponentLibrary';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';

export const LeftSidebar = (): JSX.Element => {
  const toolMode = useSelectionStore((state) => state.toolMode);
  const setToolMode = useSelectionStore((state) => state.setToolMode);
  const setPlacingType = useComponentPlacementStore((state) => state.setPlacingType);

  return (
    <aside className="flex h-full w-72 flex-col gap-4 border-r border-slate-800 bg-bench-900/60 p-4">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Tools</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['select', 'Select'],
            ['place-component', 'Place'],
            ['wire', 'Wire'],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className={`rounded-md border px-2 py-1 text-sm ${
                toolMode === mode ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 text-slate-200'
              }`}
              onClick={() => {
                setToolMode(mode as 'select' | 'place-component' | 'wire');
                if (mode !== 'place-component') {
                  setPlacingType(null);
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <ComponentLibrary />
    </aside>
  );
};
