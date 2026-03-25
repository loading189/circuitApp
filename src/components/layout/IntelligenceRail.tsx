import { DiagnosticsPanel } from '@/components/diagnostics/DiagnosticsPanel';
import { ExplainPanel } from '@/components/explain/ExplainPanel';
import { InstrumentsPanel } from '@/components/instruments/InstrumentsPanel';
import { FlowSettingsPanel } from '@/components/instruments/FlowSettingsPanel';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { ToolPanelFrame } from '@/components/layout/ToolPanelFrame';
import { TutorPanel } from '@/components/tutor/TutorPanel';
import { useToolPanelStore, type ToolPanelId } from '@/features/ui/toolPanelStore';

const tabs: Array<{ id: ToolPanelId; label: string }> = [
  { id: 'inspector', label: 'Inspector' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'explain', label: 'Explain' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'flow', label: 'Flow' },
];

export const IntelligenceRail = (): React.JSX.Element => {
  const activePanel = useToolPanelStore((state) => state.activePanel);
  const minimizedPanels = useToolPanelStore((state) => state.minimizedPanels);
  const pinnedPanels = useToolPanelStore((state) => state.pinnedPanels);
  const setActivePanel = useToolPanelStore((state) => state.setActivePanel);
  const toggleMinimized = useToolPanelStore((state) => state.toggleMinimized);
  const togglePinned = useToolPanelStore((state) => state.togglePinned);

  return (
    <aside className="panel-shell w-[360px] p-3">
      <div className="mb-3 grid grid-cols-3 gap-1">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" className={`chip-btn ${activePanel === tab.id ? 'chip-btn-active' : ''}`} onClick={() => setActivePanel(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activePanel === 'inspector' ? (
        <ToolPanelFrame title="Inspector" minimized={Boolean(minimizedPanels.inspector)} pinned={Boolean(pinnedPanels.inspector)} onToggleMinimize={() => toggleMinimized('inspector')} onTogglePin={() => togglePinned('inspector')}>
          <InspectorPanel />
        </ToolPanelFrame>
      ) : null}
      {activePanel === 'tutor' ? (
        <ToolPanelFrame title="Tutor" minimized={Boolean(minimizedPanels.tutor)} pinned={Boolean(pinnedPanels.tutor)} onToggleMinimize={() => toggleMinimized('tutor')} onTogglePin={() => togglePinned('tutor')}>
          <TutorPanel />
        </ToolPanelFrame>
      ) : null}
      {activePanel === 'explain' ? (
        <ToolPanelFrame title="Explain" minimized={Boolean(minimizedPanels.explain)} pinned={Boolean(pinnedPanels.explain)} onToggleMinimize={() => toggleMinimized('explain')} onTogglePin={() => togglePinned('explain')}>
          <ExplainPanel />
        </ToolPanelFrame>
      ) : null}
      {activePanel === 'diagnostics' ? (
        <ToolPanelFrame title="Diagnostics" minimized={Boolean(minimizedPanels.diagnostics)} pinned={Boolean(pinnedPanels.diagnostics)} onToggleMinimize={() => toggleMinimized('diagnostics')} onTogglePin={() => togglePinned('diagnostics')}>
          <DiagnosticsPanel />
        </ToolPanelFrame>
      ) : null}
      {activePanel === 'instruments' ? (
        <ToolPanelFrame title="Instruments" minimized={Boolean(minimizedPanels.instruments)} pinned={Boolean(pinnedPanels.instruments)} onToggleMinimize={() => toggleMinimized('instruments')} onTogglePin={() => togglePinned('instruments')}>
          <InstrumentsPanel />
        </ToolPanelFrame>
      ) : null}
      {activePanel === 'flow' ? (
        <ToolPanelFrame title="Flow Settings" minimized={Boolean(minimizedPanels.flow)} pinned={Boolean(pinnedPanels.flow)} onToggleMinimize={() => toggleMinimized('flow')} onTogglePin={() => togglePinned('flow')}>
          <FlowSettingsPanel />
        </ToolPanelFrame>
      ) : null}
    </aside>
  );
};
