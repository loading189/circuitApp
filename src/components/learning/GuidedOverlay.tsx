import { getBoardGeometry, useBoardStore } from '@/features/board/boardStore';
import { useLessonRunStore } from '@/features/lessons/lessonRunStore';
import type { LessonOverlayTarget } from '@/features/lessons/lessonTypes';

const HoleTarget = ({ target }: { target: LessonOverlayTarget }): React.JSX.Element | null => {
  const geometry = getBoardGeometry();
  const viewport = useBoardStore((state) => state.viewport);
  const holeId = target.holeId ?? target.holeIds?.[0];
  if (!holeId) {
    return null;
  }
  const hole = geometry.holesById[holeId];
  if (!hole) {
    return null;
  }
  const x = hole.x * viewport.zoom + viewport.panX;
  const y = hole.y * viewport.zoom + viewport.panY;

  return (
    <g>
      <circle cx={x} cy={y} r={11} className="animate-pulse" fill="rgba(34,211,238,0.2)" stroke="#67e8f9" strokeWidth={2} />
      {target.label ? <text x={x + 14} y={y - 12} fill="#a5f3fc" fontSize="11">{target.label}</text> : null}
    </g>
  );
};

const ZoneTarget = ({ target }: { target: LessonOverlayTarget }): React.JSX.Element | null => {
  const geometry = getBoardGeometry();
  const viewport = useBoardStore((state) => state.viewport);
  if (!target.zone) {
    return null;
  }

  const from = geometry.holesById[target.zone.fromHoleId];
  const to = geometry.holesById[target.zone.toHoleId];
  if (!from || !to) {
    return null;
  }

  const x = Math.min(from.x, to.x) * viewport.zoom + viewport.panX - 8;
  const y = Math.min(from.y, to.y) * viewport.zoom + viewport.panY - 8;
  const width = Math.abs(to.x - from.x) * viewport.zoom + 16;
  const height = Math.abs(to.y - from.y) * viewport.zoom + 16;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={8} fill="rgba(45,212,191,0.08)" stroke="#2dd4bf" strokeDasharray="6 4" />
      {target.label ? <text x={x + 6} y={y - 6} fill="#99f6e4" fontSize="11">{target.label}</text> : null}
    </g>
  );
};

export const GuidedOverlay = (): React.JSX.Element | null => {
  const run = useLessonRunStore((state) => state.activeRun);
  if (!run || run.supportLevel === 'sandbox' || !run.highlightedTargets.length) {
    return null;
  }

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      {run.highlightedTargets.map((target) => {
        if (target.type === 'breadboard-zone') {
          return <ZoneTarget key={target.id} target={target} />;
        }
        if (target.type === 'breadboard-hole' || target.type === 'wire-start' || target.type === 'wire-end' || target.type === 'node') {
          return <HoleTarget key={target.id} target={target} />;
        }
        return null;
      })}
    </svg>
  );
};
