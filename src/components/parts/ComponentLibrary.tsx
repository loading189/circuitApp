import { COMPONENT_PALETTE, type ComponentType } from '@/features/components/componentTypes';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useSelectionStore } from '@/features/board/selectionStore';

export const ComponentLibrary = (): JSX.Element => {
  const setPlacingType = useComponentPlacementStore((state) => state.setPlacingType);
  const placingType = useComponentPlacementStore((state) => state.placingType);
  const setToolMode = useSelectionStore((state) => state.setToolMode);

  const selectType = (type: ComponentType): void => {
    setToolMode('place-component');
    setPlacingType(type);
  };

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Component Library</h2>
      <div className="space-y-2">
        {COMPONENT_PALETTE.map((item) => {
          const active = item.type === placingType;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => selectType(item.type)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                active
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                  : 'border-slate-700 bg-slate-900/60 text-slate-100 hover:border-slate-500'
              }`}
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
