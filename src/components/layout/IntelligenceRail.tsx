import { DiagnosticsPanel } from '@/components/diagnostics/DiagnosticsPanel';
import { ExplainPanel } from '@/components/explain/ExplainPanel';
import { InstrumentsPanel } from '@/components/instruments/InstrumentsPanel';
import { FlowSettingsPanel } from '@/components/instruments/FlowSettingsPanel';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { ToolPanelFrame } from '@/components/layout/ToolPanelFrame';
import { TutorPanel } from '@/components/tutor/TutorPanel';
import { useToolPanelStore, type ToolPanelId } from '@/features/ui/toolPanelStore';
import { useLessonStore } from '@/features/lessons/lessonStore';

const secondaryTabs: Array<{ id: ToolPanelId; label: string }> = [
  { id: 'inspector', label: 'Inspector' },
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
  const activeSupportLevel = useLessonStore((state) => state.activeSupportLevel);
  const lessonMode = activeSupportLevel !== 'sandbox';

  return (
    <aside className="panel-shell w-[360px] p-3">
      <div className="mb-2">
        <p className="panel-title">AI Assistant</p>
        <p className="text-[11px] text-token-secondary">{lessonMode ? 'Primary lesson intelligence surface' : 'Ask, inspect, and debug with context'}</p>
      </div>

      <ToolPanelFrame title="Tutor" minimized={Boolean(minimizedPanels.tutor)} pinned={Boolean(pinnedPanels.tutor)} onToggleMinimize={() => toggleMinimized('tutor')} onTogglePin={() => togglePinned('tutor')}>
        <TutorPanel />
      </ToolPanelFrame>

      <div className="mb-3 mt-3 flex flex-wrap gap-1">
        {secondaryTabs.map((tab) => (
          <button key={tab.id} type="button" className={`chip-btn ${activePanel === tab.id ? 'chip-btn-active' : ''}`} onClick={() => setActivePanel(activePanel === tab.id ? 'tutor' : tab.id)}>
            {activePanel === tab.id ? `Hide ${tab.label}` : tab.label}
          </button>
        ))}
      </div>

      {activePanel === 'inspector' ? (
        <ToolPanelFrame title="Inspector" minimized={Boolean(minimizedPanels.inspector)} pinned={Boolean(pinnedPanels.inspector)} onToggleMinimize={() => toggleMinimized('inspector')} onTogglePin={() => togglePinned('inspector')}>
          <InspectorPanel />
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
