import { useSelectionStore, type ToolMode } from '@/features/board/selectionStore';
import { useBoardStore } from '@/features/board/boardStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useWireStore } from '@/features/wiring/wirePlacement';
import { WIRE_COLOR_HEX, type WireColor } from '@/features/wiring/wireTypes';

const tools: Array<{ id: ToolMode; label: string }> = [
  { id: 'select', label: 'Select' },
  { id: 'wire', label: 'Wire' },
  { id: 'probe', label: 'Probe' },
  { id: 'pan', label: 'Pan' },
];

export const WorkbenchToolbar = (): JSX.Element => {
  const toolMode = useSelectionStore((s) => s.toolMode);
  const setToolMode = useSelectionStore((s) => s.setToolMode);
  const setPlacingType = useComponentPlacementStore((s) => s.setPlacingType);
  const activeColor = useWireStore((s) => s.activeColor);
  const setActiveColor = useWireStore((s) => s.setActiveColor);
  const resetViewport = useBoardStore((s) => s.resetViewport);

  return (
    <div className="pointer-events-auto absolute left-5 top-4 z-20 flex items-center gap-2 rounded-xl border border-token-soft bg-[#020617e6] px-3 py-2 backdrop-blur">
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={() => {
            setToolMode(tool.id);
            if (tool.id !== 'wire') {
              setPlacingType(null);
            }
          }}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${toolMode === tool.id ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:text-white'}`}
        >
          {tool.label}
        </button>
      ))}
      <button type="button" onClick={resetViewport} className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:border-cyan-400">
        Reset View
      </button>

      <div className="ml-2 flex items-center gap-1 border-l border-slate-700 pl-2">
        {(Object.keys(WIRE_COLOR_HEX) as WireColor[]).slice(0, 7).map((color) => (
          <button
            key={color}
            type="button"
            title={`Wire color: ${color}`}
            onClick={() => setActiveColor(color)}
            className={`h-4 w-4 rounded-full border ${activeColor === color ? 'border-white ring-1 ring-cyan-300' : 'border-slate-500'}`}
            style={{ backgroundColor: WIRE_COLOR_HEX[color] }}
          />
        ))}
      </div>
    </div>
  );
};
