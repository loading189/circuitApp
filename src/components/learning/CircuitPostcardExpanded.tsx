import type { CircuitPostcardData } from '@/features/learning/postcardTypes';

export const CircuitPostcardExpanded = ({ card }: { card: CircuitPostcardData }): JSX.Element => (
  <div className="mt-3 space-y-2 text-xs">
    <p><span className="text-token-secondary">Building:</span> {card.buildSummary}</p>
    <div>
      <p className="text-token-secondary">Observe</p>
      <ul className="list-disc pl-4">
        {card.observePoints.map((point) => <li key={point}>{point}</li>)}
      </ul>
    </div>
    <div>
      <p className="text-token-secondary">Common mistakes</p>
      <ul className="list-disc pl-4">
        {card.commonMistakes.map((point) => <li key={point}>{point}</li>)}
      </ul>
    </div>
    <div className="rounded-md border border-token-soft bg-token-elevated p-2 text-[11px] text-token-secondary">{card.previewData}</div>
    <div className="flex flex-wrap gap-2">
      {card.quickActions.map((action) => (
        <button key={action} type="button" className="chip-btn">{action}</button>
      ))}
    </div>
  </div>
);
