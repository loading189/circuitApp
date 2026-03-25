import { useMemo, useState } from 'react';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { COMPONENT_PALETTE, type ComponentCategory, type ComponentType } from '@/features/components/componentTypes';

const categories: ComponentCategory[] = ['Power', 'Passive', 'Semiconductors', 'Switches', 'Instruments'];

export const ComponentLibrary = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const setPlacingType = useComponentPlacementStore((state) => state.setPlacingType);
  const placingType = useComponentPlacementStore((state) => state.placingType);
  const setToolMode = useSelectionStore((state) => state.setToolMode);

  const grouped = useMemo(() => {
    const filtered = COMPONENT_PALETTE.filter((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase().trim()),
    );

    return categories.map((category) => ({
      category,
      items: filtered.filter((item) => item.category === category),
    }));
  }, [query]);

  const selectType = (type: ComponentType): void => {
    if (type === 'jumper-wire') {
      setToolMode('wire');
      setPlacingType(null);
      return;
    }

    setToolMode('place-component');
    setPlacingType(type);
  };

  return (
    <section className="mt-3 min-h-0 flex-1 overflow-hidden">
      <h2 className="panel-title">Component Library</h2>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mb-3 w-full rounded-lg border border-token-soft bg-token-elevated px-2 py-1.5 text-xs text-token-primary outline-none transition focus:border-cyan-400"
        placeholder="Search parts"
      />
      <div className="max-h-[calc(100vh-240px)] space-y-3 overflow-auto pr-1">
        {grouped.map((group) => (
          <div key={group.category}>
            <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-token-secondary">{group.category}</p>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const active = item.type === placingType;
                return (
                  <button key={item.type} type="button" onClick={() => selectType(item.type)} className={`component-tile ${active ? 'component-tile-active' : ''}`}>
                    <span className="icon-pill">{item.icon}</span>
                    <span className="flex-1 text-left">
                      <span className="block text-xs font-medium">{item.title}</span>
                      <span className="block text-[11px] text-token-secondary">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
