import { useState } from 'react';
import { DiagnosticsPanel } from '@/components/diagnostics/DiagnosticsPanel';
import { ExplainPanel } from '@/components/explain/ExplainPanel';
import { InstrumentsPanel } from '@/components/instruments/InstrumentsPanel';
import { TutorPanel } from '@/components/tutor/TutorPanel';

const tabs = ['Tutor', 'Explain', 'Diagnostics', 'Instruments'] as const;
type RailTab = (typeof tabs)[number];

export const IntelligenceRail = (): JSX.Element => {
  const [active, setActive] = useState<RailTab>('Tutor');

  return (
    <aside className="panel-shell w-[360px] p-3">
      <div className="mb-3 grid grid-cols-4 gap-1">
        {tabs.map((tab) => (
          <button key={tab} type="button" className={`chip-btn ${active === tab ? 'chip-btn-active' : ''}`} onClick={() => setActive(tab)}>
            {tab}
          </button>
        ))}
      </div>
      {active === 'Tutor' ? <TutorPanel /> : null}
      {active === 'Explain' ? <ExplainPanel /> : null}
      {active === 'Diagnostics' ? <DiagnosticsPanel /> : null}
      {active === 'Instruments' ? <InstrumentsPanel /> : null}
    </aside>
  );
};
