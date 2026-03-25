import type { CircuitPostcardData } from '@/features/learning/postcardTypes';

export const CircuitPostcardCompact = ({ card }: { card: CircuitPostcardData }): JSX.Element => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-200">{card.conceptTitle}</p>
    <h3 className="text-sm font-semibold text-token-primary">{card.title}</h3>
    <p className="mt-1 text-xs text-token-secondary">{card.shortSummary}</p>
  </div>
);
