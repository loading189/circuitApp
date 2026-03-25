import { useBoardStore } from '@/features/board/boardStore';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { explainSelection } from '@/features/explanations/explainEngine';
import { useSimulationStore } from '@/features/simulation/simulationStore';

export const ExplainPanel = (): JSX.Element => {
  const selectedHoleId = useBoardStore((state) => state.selectedHoleId);
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);
  const selectedComponent = useComponentPlacementStore((state) =>
    state.components.find((component) => component.id === selectedComponentId) ?? null,
  );
  const snapshot = useSimulationStore((state) => state.snapshot);

  const explanation = explainSelection({ selectedComponent, selectedHoleId, snapshot });

  return (
    <section className="rail-panel">
      <h3 className="panel-title">Explain</h3>
      <h4 className="text-sm font-semibold text-token-primary">{explanation.title}</h4>
      <dl className="mt-3 space-y-2 text-xs">
        <div>
          <dt className="text-token-secondary">What is this</dt>
          <dd>{explanation.whatIsThis}</dd>
        </div>
        <div>
          <dt className="text-token-secondary">What it is doing</dt>
          <dd>{explanation.whatDoingHere}</dd>
        </div>
        <div>
          <dt className="text-token-secondary">Current condition</dt>
          <dd>{explanation.currentCondition}</dd>
        </div>
        <div>
          <dt className="text-token-secondary">Why it matters</dt>
          <dd>{explanation.whyItMatters}</dd>
        </div>
      </dl>
    </section>
  );
};
