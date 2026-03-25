import { useEffect, useMemo, useRef, useState } from 'react';
import { getBoardGeometry, useBoardStore } from '@/features/board/boardStore';
import { getStripForHole, getStripMembers } from '@/features/board/breadboardModel';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import { routeWirePath } from '@/features/wiring/wireRouting';
import { useWireStore } from '@/features/wiring/wirePlacement';
import { WIRE_COLOR_HEX } from '@/features/wiring/wireTypes';
import type { PlacedComponent } from '@/features/components/componentTypes';
import { formatResistance } from '@/features/components/resistorPresets';

const RESISTOR_BAND_COLORS = ['#7c2d12', '#111827', '#92400e'];

interface DragState {
  componentId: string;
  originalHoles: string[];
  pointerToAnchor: { x: number; y: number };
  moved: boolean;
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

  return !nearest || nearest.distance > threshold ? null : nearest.id;
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
  const setSelectedWireId = useSelectionStore((state) => state.setSelectedWireId);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);
  const selectedWireId = useSelectionStore((state) => state.selectedWireId);

  const wires = useWireStore((state) => state.wires);
  const wireStartHoleId = useWireStore((state) => state.wireStartHoleId);
  const wirePreviewHoleId = useWireStore((state) => state.wirePreviewHoleId);
  const hoveredWireId = useWireStore((state) => state.hoveredWireId);
  const activeColor = useWireStore((state) => state.activeColor);
  const setHoveredWireId = useWireStore((state) => state.setHoveredWireId);
  const startWireAt = useWireStore((state) => state.startWireAt);
  const completeWireTo = useWireStore((state) => state.completeWireTo);
  const previewWireTo = useWireStore((state) => state.previewWireTo);
  const cancelWire = useWireStore((state) => state.cancelWire);

  const simState = useSimulationStore((state) => state.status);

  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [dragPreviewHoleIds, setDragPreviewHoleIds] = useState<string[] | null>(null);
  const [dragValid, setDragValid] = useState(false);

  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelWire();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelWire]);

  const highlightedMembers = useMemo(() => {
    const base = hoveredHoleId ?? (toolMode === 'wire' ? wireStartHoleId : null);
    return base ? new Set(getStripMembers(base)) : new Set<string>();
  }, [hoveredHoleId, toolMode, wireStartHoleId]);

  const boardToScene = (clientX: number, clientY: number, host: Element) => {
    const box = host.getBoundingClientRect();
    return { x: (clientX - box.left - viewport.panX) / viewport.zoom, y: (clientY - box.top - viewport.panY) / viewport.zoom };
  };

  const previewWirePath = (() => {
    if (!wireStartHoleId || !wirePreviewHoleId || wireStartHoleId === wirePreviewHoleId) {
      return null;
    }
    const from = geometry.holesById[wireStartHoleId];
    const to = geometry.holesById[wirePreviewHoleId];
    if (!from || !to) {
      return null;
    }
    return routeWirePath(from, to);
  })();

  const showDenseLabels = viewport.zoom > 0.75;

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-token-soft bg-[#050912]"
      onContextMenu={(event) => {
        if (wireStartHoleId) {
          event.preventDefault();
          cancelWire();
        }
      }}
      onPointerMove={(event) => {
        const dragState = dragStateRef.current;
        if (!dragState) {
          if (!panStartRef.current) {
            return;
          }
          panBy(event.clientX - panStartRef.current.x, event.clientY - panStartRef.current.y);
          panStartRef.current = { x: event.clientX, y: event.clientY };
          return;
        }

        const host = event.currentTarget;
        const scene = boardToScene(event.clientX, event.clientY, host);
        const anchorId = dragState.originalHoles[0];
        const anchorHole = geometry.holesById[anchorId];
        if (!anchorHole) {
          return;
        }

        if (!dragState.moved && Math.hypot(event.movementX, event.movementY) > 2) {
          dragState.moved = true;
        }

        const newAnchorX = scene.x - dragState.pointerToAnchor.x;
        const newAnchorY = scene.y - dragState.pointerToAnchor.y;
        const snappedAnchorId = findNearestHole(newAnchorX, newAnchorY);
        if (!snappedAnchorId) {
          setDragValid(false);
          setDragPreviewHoleIds(null);
          return;
        }

        const snappedHole = geometry.holesById[snappedAnchorId];
        const dx = snappedHole.x - anchorHole.x;
        const dy = snappedHole.y - anchorHole.y;
        const previewHoles = dragState.originalHoles.map((holeId) => {
          const sourceHole = geometry.holesById[holeId];
          return sourceHole ? findNearestHole(sourceHole.x + dx, sourceHole.y + dy, 20) : null;
        });

        const isValid = previewHoles.every((candidate): candidate is string => Boolean(candidate));
        setDragValid(isValid);
        setDragPreviewHoleIds(isValid ? previewHoles : null);
      }}
      onPointerUp={() => {
        panStartRef.current = null;
        const dragState = dragStateRef.current;
        if (dragState?.moved && dragPreviewHoleIds && dragValid) {
          moveComponentToHoles(dragState.componentId, dragPreviewHoleIds);
          setSelectedHole(dragPreviewHoleIds[0]);
        }

        dragStateRef.current = null;
        setDragPreviewHoleIds(null);
        setDragValid(false);
        document.body.style.cursor = 'default';
      }}
      onWheel={(event) => {
        event.preventDefault();
        if (event.shiftKey) {
          panBy(-event.deltaY * 0.3, 0);
          return;
        }
        zoomBy(event.deltaY < 0 ? 0.07 : -0.07);
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
            x={0}
            y={0}
            width={geometry.width}
            height={geometry.height}
            fill="transparent"
            onPointerDown={(event) => {
              const canPan = toolMode === 'pan' || event.button === 1;
              if (canPan) {
                panStartRef.current = { x: event.clientX, y: event.clientY };
                return;
              }

              if (event.button !== 0) {
                return;
              }

              clearSelection();
              if (toolMode !== 'wire') {
                setSelectedHole(null);
              }
            }}
          />

          {wires.map((wire) => {
            const from = geometry.holesById[wire.startHoleId];
            const to = geometry.holesById[wire.endHoleId];
            if (!from || !to) {
              return null;
            }
            const hovered = hoveredWireId === wire.id;
            const selected = selectedWireId === wire.id;
            const path = routeWirePath(from, to);
            const color = WIRE_COLOR_HEX[wire.color];

            return (
              <g
                key={wire.id}
                onPointerEnter={() => setHoveredWireId(wire.id)}
                onPointerLeave={() => setHoveredWireId(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedWireId(wire.id);
                  setSelectedHole(wire.startHoleId);
                }}
              >
                <path d={path} stroke={selected ? '#e2e8f0' : hovered ? '#bae6fd' : 'transparent'} strokeWidth={selected ? 10 : 8} fill="none" strokeLinecap="round" />
                <path d={path} stroke={color} strokeWidth={selected ? 5 : 4} fill="none" strokeLinecap="round" opacity={0.96} />
                <circle cx={from.x} cy={from.y} r={selected ? 4.8 : 4.2} fill="#f8fafc" stroke={color} strokeWidth={2} />
                <circle cx={to.x} cy={to.y} r={selected ? 4.8 : 4.2} fill="#f8fafc" stroke={color} strokeWidth={2} />
              </g>
            );
          })}

          {previewWirePath ? (
            <path d={previewWirePath} stroke={WIRE_COLOR_HEX[activeColor]} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="6 4" opacity={0.9} />
          ) : null}

          {geometry.holes.map((hole) => {
            const isHoverGroup = highlightedMembers.has(hole.id);
            const isSelected = selectedHoleId === hole.id;
            const isDragPreview = dragPreviewHoleIds?.includes(hole.id);
            const isWireStart = wireStartHoleId === hole.id;
            const isWirePreview = wirePreviewHoleId === hole.id && wireStartHoleId !== wirePreviewHoleId;

            return (
              <circle
                key={hole.id}
                cx={hole.x}
                cy={hole.y}
                r={geometry.holeRadius + (isDragPreview || isWireStart ? 2 : 0)}
                fill={
                  isWireStart
                    ? '#14b8a6'
                    : isWirePreview
                      ? '#22d3ee'
                      : isSelected
                        ? '#0ea5e9'
                        : isDragPreview
                          ? dragValid
                            ? '#14b8a6'
                            : '#ef4444'
                          : isHoverGroup
                            ? '#38bdf8'
                            : '#41566f'
                }
                opacity={isHoverGroup || isSelected || isDragPreview || isWireStart || isWirePreview ? 1 : 0.82}
                onPointerEnter={() => {
                  setHoveredHole(hole.id);
                  if (toolMode === 'wire' && wireStartHoleId) {
                    previewWireTo(hole.id);
                  }
                }}
                onPointerLeave={() => {
                  setHoveredHole(null);
                  if (toolMode === 'wire') {
                    previewWireTo(null);
                  }
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedHole(hole.id);

                  if (toolMode === 'wire') {
                    if (!wireStartHoleId) {
                      startWireAt(hole.id);
                    } else {
                      completeWireTo(hole.id);
                    }
                    return;
                  }

                  if (toolMode === 'place-component' && placingType) {
                    placeComponentAt(hole.id);
                  }
                }}
              />
            );
          })}

          {components.map((component) => {
            const terminalHoles = component.terminals.map((terminal) => geometry.holesById[terminal.holeId]).filter(Boolean);
            if (!terminalHoles.length) {
              return null;
            }

            const first = terminalHoles[0]!;
            const last = terminalHoles[terminalHoles.length - 1]!;
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
                  if (toolMode !== 'select') {
                    return;
                  }
                  event.stopPropagation();
                  const host = event.currentTarget.ownerSVGElement;
                  if (!host) {
                    return;
                  }
                  const scene = boardToScene(event.clientX, event.clientY, host);
                  dragStateRef.current = {
                    componentId: component.id,
                    originalHoles: component.terminals.map((terminal) => terminal.holeId),
                    pointerToAnchor: { x: scene.x - first.x, y: scene.y - first.y },
                    moved: false,
                  };
                  setSelectedComponentId(component.id);
                  document.body.style.cursor = 'grabbing';
                }}
              >
                <line x1={first.x} y1={first.y} x2={last.x} y2={last.y} stroke="#cbd5e1" strokeWidth={2} strokeLinecap="round" opacity={0.8} />

                {component.type === 'resistor' ? (
                  <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                    <rect x={-28} y={-9} width={56} height={18} rx={8} fill="#fbbf24" stroke={selected ? '#7dd3fc' : hovered ? '#67e8f9' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                    {RESISTOR_BAND_COLORS.map((band, index) => (
                      <rect key={band} x={-14 + index * 10} y={-9} width={4} height={18} fill={band} rx={2} opacity={0.9} />
                    ))}
                  </g>
                ) : null}

                {component.type === 'led' ? (
                  <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                    <circle cx={0} cy={0} r={10} fill="#fecaca" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} filter={simState === 'running' ? 'url(#ledGlow)' : undefined} />
                    <line x1={6} y1={-9} x2={6} y2={9} stroke="#7f1d1d" strokeWidth={1.6} />
                  </g>
                ) : null}


                {component.type === 'capacitor' ? (
                  <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                    <rect x={-8} y={-13} width={16} height={26} rx={4} fill="#166534" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                    <line x1={2} y1={-10} x2={2} y2={10} stroke="#bbf7d0" strokeWidth={1.2} />
                    <text x={-14} y={4} fontSize={10} fill="#bbf7d0">+</text>
                  </g>
                ) : null}

                {component.type === 'spst-switch' ? (
                  <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                    <rect x={-20} y={-8} width={40} height={16} rx={8} fill="#431407" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                    <line x1={-10} y1={component.props.isClosed ? 0 : 2} x2={10} y2={component.props.isClosed ? 0 : -6} stroke="#fdba74" strokeWidth={3} strokeLinecap="round" />
                  </g>
                ) : null}

                {component.type === 'npn-transistor' ? (
                  <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                    <circle cx={0} cy={0} r={12} fill="#312e81" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                    <text x={-11} y={21} fontSize={8} fill="#ddd6fe">B C E</text>
                  </g>
                ) : null}

                {component.type === 'dc-power-supply' ? (
                  <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                    <rect x={-18} y={-12} width={36} height={24} rx={8} fill="#082f49" stroke={selected ? '#7dd3fc' : '#0f172a'} strokeWidth={selected ? 2 : 1.4} />
                  </g>
                ) : null}

                {component.type === 'ground' ? (
                  <g transform={`translate(${centerX} ${centerY}) rotate(${angle})`}>
                    <text x={-6} y={6} fontSize={18} fill="#cbd5e1">⏚</text>
                  </g>
                ) : null}

                {(component.type === 'resistor' || selected || hovered) && showDenseLabels ? (
                  <g transform={`translate(${centerX} ${centerY - 20})`}>
                    <rect x={-32} y={-12} width={64} height={18} rx={6} fill="#0f172a" opacity={0.92} />
                    <text x={0} y={1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="#bae6fd">{componentLabel(component)}</text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {hoveredHoleId ? <text x={16} y={geometry.height - 18} fontSize="12" fill="#0f172a">{hoveredHoleId} • strip {getStripForHole(hoveredHoleId)}</text> : null}
        </g>
      </svg>
    </div>
  );
};
