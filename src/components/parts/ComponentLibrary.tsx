import { useMemo, useState } from 'react';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { COMPONENT_CATEGORIES, SIMULATION_SUPPORT_TIERS, type ComponentType, type SimulationSupportTier } from '@/features/components/componentTypes';
import { componentRegistry } from '@/features/components/componentRegistry';
import { searchComponents } from '@/features/components/componentSearch';

export const ComponentLibrary = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | (typeof COMPONENT_CATEGORIES)[number]>('all');
  const [supportTier, setSupportTier] = useState<'all' | SimulationSupportTier>('all');
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [activeType, setActiveType] = useState<ComponentType | null>(null);

  const setPlacingType = useComponentPlacementStore((state) => state.setPlacingType);
  const placingType = useComponentPlacementStore((state) => state.placingType);
  const setToolMode = useSelectionStore((state) => state.setToolMode);

  const results = useMemo(
    () =>
      searchComponents(componentRegistry.all, {
        query,
        category,
        supportTier,
        beginnerOnly,
      }),
    [query, category, supportTier, beginnerOnly],
  );

  const selectedDefinition = useMemo(
    () => componentRegistry.all.find((item) => item.type === (activeType ?? placingType ?? null)) ?? null,
    [activeType, placingType],
  );

  const selectType = (type: ComponentType): void => {
    setActiveType(type);

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
      <h2 className="panel-title">Component Encyclopedia</h2>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mb-2 w-full rounded-lg border border-token-soft bg-token-elevated px-2 py-1.5 text-xs text-token-primary outline-none transition focus:border-cyan-400"
        placeholder="Search name, alias, function, tags"
      />
      <div className="mb-2 grid grid-cols-2 gap-1">
        <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)} className="rounded border border-token-soft bg-token-elevated px-2 py-1 text-[11px]">
          <option value="all">All categories</option>
          {COMPONENT_CATEGORIES.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <select value={supportTier} onChange={(event) => setSupportTier(event.target.value as typeof supportTier)} className="rounded border border-token-soft bg-token-elevated px-2 py-1 text-[11px]">
          <option value="all">All support tiers</option>
          {SIMULATION_SUPPORT_TIERS.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <label className="mb-2 flex items-center gap-2 text-[11px] text-token-secondary">
        <input type="checkbox" checked={beginnerOnly} onChange={(event) => setBeginnerOnly(event.target.checked)} /> Beginner-friendly only
      </label>

      <div className="grid max-h-[calc(100vh-280px)] grid-cols-1 gap-3 overflow-auto pr-1">
        <div className="space-y-1.5">
          {results.map((item) => {
            const active = item.type === placingType;
            return (
              <button key={item.type} type="button" onClick={() => selectType(item.type)} className={`component-tile ${active ? 'component-tile-active' : ''}`}>
                <span className="icon-pill">{item.visual2D.icon}</span>
                <span className="flex-1 text-left">
                  <span className="block text-xs font-medium">{item.displayName}</span>
                  <span className="block text-[11px] text-token-secondary">{item.description}</span>
                  <span className="block text-[10px] uppercase tracking-[0.08em] text-cyan-300">{item.category} · {item.simulationSupport}</span>
                </span>
              </button>
            );
          })}
        </div>

        {selectedDefinition ? (
          <aside className="rounded-lg border border-token-soft bg-token-elevated/80 p-2 text-xs">
            <p className="text-sm font-semibold text-token-primary">{selectedDefinition.displayName}</p>
            <p className="text-token-secondary">{selectedDefinition.learning.plainExplanation}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-cyan-300">{selectedDefinition.category} · {selectedDefinition.simulationSupport}</p>
            <p className="mt-2 text-[11px] text-token-secondary">Pins: {selectedDefinition.terminals.map((terminal) => `${terminal.label}`).join(' · ')}</p>
            <p className="mt-2 text-[11px] text-token-secondary">Common uses: {selectedDefinition.learning.commonUses.join(', ')}</p>
            <p className="mt-1 text-[11px] text-token-secondary">Common mistakes: {selectedDefinition.learning.commonMistakes.join(', ')}</p>
            <button type="button" onClick={() => selectType(selectedDefinition.type)} className="mt-2 w-full rounded border border-cyan-700 px-2 py-1 text-[11px] text-cyan-200">
              Add to board
            </button>
          </aside>
        ) : null}
      </div>
    </section>
  );
};
