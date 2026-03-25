import { useMemo, useRef } from 'react';
import { getBoardGeometry, useBoardStore } from '@/features/board/boardStore';
import { getStripForHole, getStripMembers } from '@/features/board/breadboardModel';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { componentColor } from '@/features/components/componentRendering';
import { useSimulationStore } from '@/features/simulation/simulationStore';

export const BreadboardSvg = (): JSX.Element => {
  const geometry = getBoardGeometry();
  const viewport = useBoardStore((state) => state.viewport);
  const hoveredHoleId = useBoardStore((state) => state.hoveredHoleId);
  const selectedHoleId = useBoardStore((state) => state.selectedHoleId);
  const setHoveredHole = useBoardStore((state) => state.setHoveredHole);
  const setSelectedHole = useBoardStore((state) => state.setSelectedHole);
  const zoomBy = useBoardStore((state) => state.zoomBy);
  const panBy = useBoardStore((state) => state.panBy);

  const components = useComponentPlacementStore((state) => state.components);
  const placeComponentAt = useComponentPlacementStore((state) => state.placeComponentAt);
  const placingType = useComponentPlacementStore((state) => state.placingType);

  const toolMode = useSelectionStore((state) => state.toolMode);
  const setSelectedComponentId = useSelectionStore((state) => state.setSelectedComponentId);
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);

  const simState = useSimulationStore((state) => state.status);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const highlightedMembers = useMemo(() => {
    if (!hoveredHoleId) {
      return new Set<string>();
    }

    return new Set(getStripMembers(hoveredHoleId));
  }, [hoveredHoleId]);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-token-soft bg-[#050912]"
      onWheel={(event) => {
        event.preventDefault();
        if (event.shiftKey) {
          panBy(-event.deltaY * 0.3, 0);
        } else {
          zoomBy(event.deltaY < 0 ? 0.07 : -0.07);
        }
      }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).dataset.role === 'board-surface') {
          dragStartRef.current = { x: event.clientX, y: event.clientY };
        }
      }}
      onPointerMove={(event) => {
        if (!dragStartRef.current) {
          return;
        }
        const dx = event.clientX - dragStartRef.current.x;
        const dy = event.clientY - dragStartRef.current.y;
        dragStartRef.current = { x: event.clientX, y: event.clientY };
        panBy(dx, dy);
      }}
      onPointerUp={() => {
        dragStartRef.current = null;
      }}
    >
      <svg viewBox={`0 0 ${geometry.width} ${geometry.height}`} className="h-full w-full">
        <defs>
          <filter id="ledGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          data-role="board-surface"
          x={0}
          y={0}
          width={geometry.width}
          height={geometry.height}
          fill="transparent"
          transform={`translate(${viewport.panX} ${viewport.panY}) scale(${viewport.zoom})`}
        />

        <g transform={`translate(${viewport.panX} ${viewport.panY}) scale(${viewport.zoom})`}>
          <rect x={12} y={12} rx={18} width={geometry.width - 24} height={geometry.height - 24} fill="#edf4fb" stroke="#7f92a8" strokeWidth={1.4} />

          {geometry.holes.map((hole) => {
            const isHoverGroup = highlightedMembers.has(hole.id);
            const isSelected = selectedHoleId === hole.id;
            return (
              <circle
                key={hole.id}
                cx={hole.x}
                cy={hole.y}
                r={geometry.holeRadius}
                fill={isSelected ? '#0ea5e9' : isHoverGroup ? '#38bdf8' : '#41566f'}
                opacity={isHoverGroup || isSelected ? 1 : 0.8}
                onPointerEnter={() => setHoveredHole(hole.id)}
                onPointerLeave={() => setHoveredHole(null)}
                onClick={() => {
                  setSelectedHole(hole.id);
                  if (toolMode === 'place-component' && placingType) {
                    placeComponentAt(hole.id);
                  }
                }}
              />
            );
          })}

          {components.map((component) => {
            const terminalHoles = component.terminals
              .map((terminal) => geometry.holesById[terminal.holeId])
              .filter((hole): hole is NonNullable<typeof hole> => Boolean(hole));

            if (!terminalHoles.length) {
              return null;
            }

            const first = terminalHoles[0];
            const last = terminalHoles[terminalHoles.length - 1];
            const y = (first.y + last.y) / 2;
            const x = (first.x + last.x) / 2;
            const selected = selectedComponentId === component.id;
            const isLed = component.type === 'led';

            return (
              <g
                key={component.id}
                onClick={() => {
                  setSelectedComponentId(component.id);
                  setSelectedHole(first.id);
                }}
                className="cursor-pointer"
              >
                <line
                  x1={first.x}
                  y1={first.y}
                  x2={last.x}
                  y2={last.y}
                  stroke={componentColor(component)}
                  strokeWidth={selected ? 8 : 6}
                  strokeLinecap="round"
                  opacity={component.type === 'jumper-wire' ? 0.9 : 0.82}
                />
                <rect
                  x={x - 16}
                  y={y - 10}
                  rx={6}
                  width={32}
                  height={20}
                  fill={selected ? '#0f172a' : '#1c2736'}
                  stroke={componentColor(component)}
                  strokeWidth={selected ? 2 : 1}
                  filter={isLed && simState === 'running' ? 'url(#ledGlow)' : undefined}
                />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="#dbeafe">
                  {component.name}
                </text>
              </g>
            );
          })}

          {hoveredHoleId ? (
            <text x={16} y={geometry.height - 18} fontSize="12" fill="#0f172a">
              {hoveredHoleId} • strip {getStripForHole(hoveredHoleId)}
            </text>
          ) : null}
        </g>
      </svg>
    </div>
  );
};
