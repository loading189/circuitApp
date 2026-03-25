import { useFlowVisualizationStore } from '@/features/flow/flowVisualizationStore';

export const FlowSettingsPanel = (): JSX.Element => {
  const enabled = useFlowVisualizationStore((state) => state.enabled);
  const showDirectionArrows = useFlowVisualizationStore((state) => state.showDirectionArrows);
  const emphasizeBrokenPaths = useFlowVisualizationStore((state) => state.emphasizeBrokenPaths);
  const intensityScale = useFlowVisualizationStore((state) => state.intensityScale);
  const toggleEnabled = useFlowVisualizationStore((state) => state.toggleEnabled);
  const setShowDirectionArrows = useFlowVisualizationStore((state) => state.setShowDirectionArrows);
  const setEmphasizeBrokenPaths = useFlowVisualizationStore((state) => state.setEmphasizeBrokenPaths);
  const setIntensityScale = useFlowVisualizationStore((state) => state.setIntensityScale);

  return (
    <div className="space-y-2 text-xs">
      <button type="button" className={`chip-btn ${enabled ? 'chip-btn-active' : ''}`} onClick={toggleEnabled}>Show Flow {enabled ? 'ON' : 'OFF'}</button>
      <label className="flex items-center gap-2 text-token-secondary">
        <input type="checkbox" checked={showDirectionArrows} onChange={(event) => setShowDirectionArrows(event.target.checked)} /> Direction arrows
      </label>
      <label className="flex items-center gap-2 text-token-secondary">
        <input type="checkbox" checked={emphasizeBrokenPaths} onChange={(event) => setEmphasizeBrokenPaths(event.target.checked)} /> Broken path emphasis
      </label>
      <label className="block text-token-secondary">
        Intensity
        <input type="range" min={0.4} max={1.8} step={0.1} value={intensityScale} onChange={(event) => setIntensityScale(Number(event.target.value))} className="mt-1 w-full" />
      </label>
    </div>
  );
};
