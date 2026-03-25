import { useMemo, useRef, useState } from 'react';
import { getBoardGeometry, useBoardStore } from '@/features/board/boardStore';
import { getStripForHole, getStripMembers } from '@/features/board/breadboardModel';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import type { PlacedComponent } from '@/features/components/componentTypes';

const RESISTOR_BAND_COLORS = ['#7c2d12', '#111827', '#92400e'];

interface DragState {
  componentId: string;
  origin: { x: number; y: number };
  originalHoles: string[];
  pointerToAnchor: { x: number; y: number };
}

const findNearestHole = (x: number, y: number, threshold = 18) => {
  const geometry = getBoardGeometry();
  let nearest: { id: string; distance: number } | null = null;

  for (const hole of geometry.holes) {
    const distance = Math.hypot(hole.x - x, hole.y - y);
    if (!nearest || distance < nearest.distance) {
      nearest = { id: hole.id, distance };
    }
  }

  if (!nearest || nearest.distance > threshold) {
    return null;
  }

  return nearest.id;
};

const formatResistance = (ohms: number): string => {
  if (ohms >= 1000) {
    return `${Math.round(ohms / 10) / 100}kΩ`;
  }

  return `${ohms}Ω`;
};

const componentLabel = (component: PlacedComponent): string => {
  switch (component.type) {
    case 'resistor':
      return formatResistance(component.props.resistanceOhms);
    case 'capacitor':
      return `${component.props.capacitanceUf}μF`;
    case 'dc-power-supply':
      return `${component.props.voltage.toFixed(1)}V`;
    case 'led':
      return `${component.props.color.toUpperCase()} LED`;
    case 'spst-switch':
      return component.props.isClosed ? 'Closed' : 'Open';
    case 'npn-transistor':
      return `β ${component.props.beta}`;
    default:
      return component.name;
  }
};

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
  const moveComponentToHoles = useComponentPlacementStore((state) => state.moveComponentToHoles);
  const placingType = useComponentPlacementStore((state) => state.placingType);

  const toolMode = useSelectionStore((state) => state.toolMode);
  const setSelectedComponentId = useSelectionStore((state) => state.setSelectedComponentId);
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);

  const simState = useSimulationStore((state) => state.status);

  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [dragPreviewHoleIds, setDragPreviewHoleIds] = useState<string[] | null>(null);
  const [dragValid, setDragValid] = useState(false);

  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const highlightedMembers = useMemo(() => {
    if (!hoveredHoleId) {
      return new Set<string>();
    }

    return new Set(getStripMembers(hoveredHoleId));
  }, [hoveredHoleId]);

  const boardToScene = (clientX: number, clientY: number, host: Element) => {
    const box = host.getBoundingClientRect();
    const x = (clientX - box.left - viewport.panX) / viewport.zoom;
    const y = (clientY - box.top - viewport.panY) / viewport.zoom;
    return { x, y };
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-token-soft bg-[#050912]"
      onPointerMove={(event) => {
        const dragState = dragStateRef.current;
        if (!dragState) {
          if (!panStartRef.current) {
            return;
          }
          const dx = event.clientX - panStartRef.current.x;
          const dy = event.clientY - panStartRef.current.y;
          panStartRef.current = { x: event.clientX, y: event.clientY };
          panBy(dx, dy);
          return;
        }

        const scene = boardToScene(event.clientX, event.clientY, event.currentTarget);
        const newAnchorX = scene.x - dragState.pointerToAnchor.x;
        const newAnchorY = scene.y - dragState.pointerToAnchor.y;
        const snappedAnchorId = findNearestHole(newAnchorX, newAnchorY);

        if (!snappedAnchorId) {
          setDragValid(false);
          setDragPreviewHoleIds(null);
          return;
        }

        const anchorHole = geometry.holesById[snappedAnchorId];
        const originalAnchor = geometry.holesById[dragState.originalHoles[0]];
        if (!anchorHole || !originalAnchor) {
          return;
        }

        const dx = anchorHole.x - originalAnchor.x;
        const dy = anchorHole.y - originalAnchor.y;

        const previewHoles = dragState.originalHoles.map((holeId) => {
          const sourceHole = geometry.holesById[holeId];
          if (!sourceHole) {
            return null;
          }
          return findNearestHole(sourceHole.x + dx, sourceHole.y + dy, 20);
        });

        const isValid = previewHoles.every((candidate): candidate is string => Boolean(candidate));
        setDragValid(isValid);
        setDragPreviewHoleIds(isValid ? (previewHoles as string[]) : null);
      }}
      onPointerUp={() => {
        panStartRef.current = null;
        const dragState = dragStateRef.current;
        if (dragState && dragPreviewHoleIds && dragValid) {
          moveComponentToHoles(dragState.componentId, dragPreviewHoleIds);
          setSelectedHole(dragPreviewHoleIds[0]);
        }

        dragStateRef.current = null;
        setDragPreviewHoleIds(null);
        setDragValid(false);
        document.body.style.cursor = 'default';
      }}
      onPointerLeave={() => {
        panStartRef.current = null;
      }}
      onWheel={(event) => {
        event.preventDefault();
        if (event.shiftKey) {
          panBy(-event.deltaY * 0.3, 0);
        } else {
          zoomBy(event.deltaY < 0 ? 0.07 : -0.07);
        }
      }}
    >
      <svg viewBox={`0 0 ${geometry.width} ${geometry.height}`} className="h-full w-full">
        <defs>
          <filter id="ledGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${viewport.panX} ${viewport.panY}) scale(${viewport.zoom})`}>
          <rect x={12} y={12} rx={18} width={geometry.width - 24} height={geometry.height - 24} fill="#edf4fb" stroke="#7f92a8" strokeWidth={1.4} />

          <rect
            data-role="board-surface"
            x={0}
            y={0}
            width={geometry.width}
            height={geometry.height}
            fill="transparent"
            onPointerDown={(event) => {
              if (event.button !== 0) {
                return;
              }
              panStartRef.current = { x: event.clientX, y: event.clientY };
              setSelectedComponentId(null);
            }}
          />

          {geometry.holes.map((hole) => {
            const isHoverGroup = highlightedMembers.has(hole.id);
            const isSelected = selectedHoleId === hole.id;
            const isDragPreview = dragPreviewHoleIds?.includes(hole.id);
            return (
              <circle
                key={hole.id}
                cx={hole.x}
                cy={hole.y}
                r={geometry.holeRadius + (isDragPreview ? 2 : 0)}
                fill={
                  isSelected
                    ? '#0ea5e9'
                    : isDragPreview
                      ? dragValid
                        ? '#14b8a6'
                        : '#ef4444'
                      : isHoverGroup
                        ? '#38bdf8'
                        : '#41566f'
                }
                opacity={isHoverGroup || isSelected || isDragPreview ? 1 : 0.82}
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
            const centerX = (first.x + last.x) / 2;
            const centerY = (first.y + last.y) / 2;
            const angle = (Math.atan2(last.y - first.y, last.x - first.x) * 180) / Math.PI;
            const selected = selectedComponentId === component.id;
            const hovered = hoveredComponentId === component.id;

            return (
              <g
                key={component.id}
                className="cursor-pointer"
                onPointerEnter={() => {
                  setHoveredComponentId(component.id);
                  document.body.style.cursor = 'grab';
                }}
                onPointerLeave={() => {
                  setHoveredComponentId((current) => (current === component.id ? null : current));
                  document.body.style.cursor = 'default';
                }}
                onClick={() => {
                  setSelectedComponentId(component.id);
                  setSelectedHole(first.id);
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  const host = event.currentTarget.ownerSVGElement;
                  if (!host) {
                    return;
                  }
                  const scene = boardToScene(event.clientX, event.clientY, host);
                  dragStateRef.current = {
                    componentId: component.id,
                    origin: { x: first.x, y: first.y },
                    originalHoles: component.terminals.map((terminal) => terminal.holeId),
                    pointerToAnchor: { x: scene.x - first.x, y: scene.y - first.y },
                  };
                  setSelectedComponentId(component.id);
                  document.body.style.cursor = 'grabbing';
                }}
              >
                <line x1={first.x} y1={first.y} x2={last.x} y2={last.y} stroke="#cbd5e1" strokeWidth={2} strokeLinecap="round" opacity={0.8} />

                {component.type === 'jumper-wire' ? (
                  <>
                    <line x1={first.x} y1={first.y} x2={last.x} y2={last.y} stroke="#22d3ee" strokeWidth={selected ? 7 : 5} strokeLinecap="round" opacity={0.95} />
                    <circle cx={first.x} cy={first.y} r={selected ? 6 : 4} fill="#f8fafc" stroke="#22d3ee" strokeWidth={2} />
                    <circle cx={last.x} cy={last.y} r={selected ? 6 : 4} fill="#f8fafc" stroke="#22d3ee" strokeWidth={2} />
                  </>
                ) : null}

                <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                  {component.type === 'resistor' ? (
                    <>
                      <rect x={-28} y={-9} width={56} height={18} rx={8} fill="#fbbf24" stroke={selected ? '#7dd3fc' : hovered ? '#67e8f9' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                      {RESISTOR_BAND_COLORS.map((band, index) => (
                        <rect key={band} x={-14 + index * 10} y={-9} width={4} height={18} fill={band} rx={2} opacity={0.9} />
                      ))}
                    </>
                  ) : null}

                  {component.type === 'led' ? (
                    <>
                      <circle cx={0} cy={0} r={10} fill="#fecaca" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} filter={simState === 'running' ? 'url(#ledGlow)' : undefined} />
                      <line x1={6} y1={-9} x2={6} y2={9} stroke="#7f1d1d" strokeWidth={1.6} />
                    </>
                  ) : null}

                  {component.type === 'capacitor' ? (
                    <>
                      <rect x={-8} y={-13} width={16} height={26} rx={4} fill="#166534" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                      <line x1={2} y1={-10} x2={2} y2={10} stroke="#bbf7d0" strokeWidth={1.2} />
                      <text x={-14} y={4} fontSize={10} fill="#bbf7d0">+</text>
                    </>
                  ) : null}

                  {component.type === 'spst-switch' ? (
                    <>
                      <rect x={-20} y={-8} width={40} height={16} rx={8} fill="#431407" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                      <line x1={-10} y1={component.props.isClosed ? 0 : 2} x2={10} y2={component.props.isClosed ? 0 : -6} stroke="#fdba74" strokeWidth={3} strokeLinecap="round" />
                    </>
                  ) : null}

                  {component.type === 'npn-transistor' ? (
                    <>
                      <circle cx={0} cy={0} r={12} fill="#312e81" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                      <text x={-11} y={21} fontSize={8} fill="#ddd6fe">B C E</text>
                    </>
                  ) : null}

                  {component.type === 'dc-power-supply' ? (
                    <rect x={-18} y={-12} width={36} height={24} rx={8} fill="#082f49" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                  ) : null}

                  {component.type === 'ground' ? <text x={-6} y={6} fontSize={18} fill="#cbd5e1">⏚</text> : null}
                </g>

                {(component.type === 'resistor' || selected || hovered) && (
                  <g transform={`translate(${centerX} ${centerY - 20})`}>
                    <rect x={-32} y={-12} width={64} height={18} rx={6} fill="#0f172a" opacity={0.92} />
                    <text x={0} y={1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="#bae6fd">
                      {componentLabel(component)}
                    </text>
                  </g>
                )}
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
