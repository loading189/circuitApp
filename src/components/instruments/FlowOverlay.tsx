import { getBoardGeometry } from '@/features/board/boardStore';
import { computeFlowWireStates } from '@/features/flow/flowOverlayEngine';
import { useFlowVisualizationStore } from '@/features/flow/flowVisualizationStore';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import { useWireStore } from '@/features/wiring/wirePlacement';
import { routeWirePath } from '@/features/wiring/wireRouting';
import { useLessonStore } from '@/features/lessons/lessonStore';

const stateColor: Record<string, string> = {
  active: '#22d3ee',
  inactive: '#64748b',
  blocked: '#ef4444',
};

export const FlowOverlay = (): React.JSX.Element | null => {
  const enabled = useFlowVisualizationStore((state) => state.enabled);
  const showDirectionArrows = useFlowVisualizationStore((state) => state.showDirectionArrows);
  const intensityScale = useFlowVisualizationStore((state) => state.intensityScale);
  const emphasizeBrokenPaths = useFlowVisualizationStore((state) => state.emphasizeBrokenPaths);
  const wires = useWireStore((state) => state.wires);
  const snapshot = useSimulationStore((state) => state.snapshot);
  const activeLessonId = useLessonStore((state) => state.activeLessonId);
  const geometry = getBoardGeometry();
  const isFoundationFocusLesson = ['lesson-led-current-limiter', 'lesson-voltage-divider', 'lesson-rc-charge'].includes(activeLessonId ?? '');

  if (!enabled || wires.length === 0) {
    return null;
  }

  const byWireId = new Map(computeFlowWireStates(wires, snapshot).map((item) => [item.wireId, item]));

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${geometry.width} ${geometry.height}`}>
      {wires.map((wire) => {
        const from = geometry.holesById[wire.startHoleId];
        const to = geometry.holesById[wire.endHoleId];
        const flowState = byWireId.get(wire.id);
        if (!from || !to || !flowState) {
          return null;
        }

        if (!emphasizeBrokenPaths && flowState.state === 'blocked') {
          return null;
        }

        const path = routeWirePath(from, to);
        const arrowX = (from.x + to.x) / 2;
        const arrowY = (from.y + to.y) / 2;
        const arrow = flowState.forward ? '→' : '←';

        const strokeWidth = isFoundationFocusLesson && flowState.state === 'active' ? 6 : 5;
        const opacityScale = isFoundationFocusLesson && flowState.state === 'blocked' ? 1.2 : 1;
        return (
          <g key={`flow-${wire.id}`}>
            <path
              d={path}
              stroke={stateColor[flowState.state]}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              opacity={Math.max(0.15, flowState.intensity * intensityScale * opacityScale)}
            />
            {showDirectionArrows && flowState.state === 'active' ? (
              <text x={arrowX} y={arrowY} fill="#dbeafe" fontSize="12" textAnchor="middle" dominantBaseline="middle" opacity={0.95}>
                {arrow}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};
