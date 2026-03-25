import { useLessonStore } from '@/features/lessons/lessonStore';
import { useFlowVisualizationStore } from '@/features/flow/flowVisualizationStore';

export const FlowSettingsPanel = (): React.JSX.Element => {
  const enabled = useFlowVisualizationStore((state) => state.enabled);
  const showDirectionArrows = useFlowVisualizationStore((state) => state.showDirectionArrows);
  const emphasizeBrokenPaths = useFlowVisualizationStore((state) => state.emphasizeBrokenPaths);
  const intensityScale = useFlowVisualizationStore((state) => state.intensityScale);
  const toggleEnabled = useFlowVisualizationStore((state) => state.toggleEnabled);
  const setShowDirectionArrows = useFlowVisualizationStore((state) => state.setShowDirectionArrows);
  const setEmphasizeBrokenPaths = useFlowVisualizationStore((state) => state.setEmphasizeBrokenPaths);
  const setIntensityScale = useFlowVisualizationStore((state) => state.setIntensityScale);
  const activeLessonId = useLessonStore((state) => state.activeLessonId);

  const lessonHint = activeLessonId === 'lesson-led-current-limiter'
    ? enabled
      ? 'Flow ON: verify one closed path through resistor and LED, then compare after break-it changes.'
      : 'Turn on flow to inspect the closed loop and see where current stops when you break it.'
    : 'Use flow view to inspect active and broken paths.';

  return (
    <div className="space-y-2 text-xs">
      <button type="button" className={`chip-btn ${enabled ? 'chip-btn-active' : ''}`} onClick={toggleEnabled}>Show Flow {enabled ? 'ON' : 'OFF'}</button>
      <p className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100">{lessonHint}</p>
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
