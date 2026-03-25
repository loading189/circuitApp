import { ComponentLibrary } from '@/components/parts/ComponentLibrary';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';

export const LeftSidebar = (): JSX.Element => {
  const toolMode = useSelectionStore((state) => state.toolMode);
  const setToolMode = useSelectionStore((state) => state.setToolMode);
  const setPlacingType = useComponentPlacementStore((state) => state.setPlacingType);

  return (
    <aside className="panel-shell w-[300px] p-3">
      <section>
        <h2 className="panel-title">Tooling</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['select', 'Select'],
            ['place-component', 'Place'],
            ['wire', 'Wire'],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className={`chip-btn ${toolMode === mode ? 'chip-btn-active' : ''}`}
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
