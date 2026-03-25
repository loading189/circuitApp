import { getBoardGeometry, useBoardStore } from '@/features/board/boardStore';
import { useLessonRunStore } from '@/features/lessons/lessonRunStore';
import type { LessonOverlayTarget } from '@/features/lessons/lessonTypes';

const HoleTarget = ({ target, secondary = false }: { target: LessonOverlayTarget; secondary?: boolean }): React.JSX.Element | null => {
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
      <circle cx={x} cy={y} r={secondary ? 11 : 15} fill={secondary ? 'rgba(34,211,238,0.06)' : 'rgba(34,211,238,0.12)'} className={secondary ? '' : 'animate-pulse'} />
      <circle cx={x} cy={y} r={secondary ? 7 : 10} fill="rgba(14,116,144,0.2)" stroke="#67e8f9" strokeWidth={secondary ? 1.5 : 2} />
      <circle cx={x} cy={y} r={secondary ? 4 : 5} fill="#67e8f9" opacity={secondary ? 0.45 : 0.7} />
      {target.label ? <text x={x + 16} y={y - 10} fill="#cffafe" fontSize="11">{target.label}</text> : null}
    </g>
  );
};

const ZoneTarget = ({ target, secondary = false }: { target: LessonOverlayTarget; secondary?: boolean }): React.JSX.Element | null => {
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

  const x = Math.min(from.x, to.x) * viewport.zoom + viewport.panX - 10;
  const y = Math.min(from.y, to.y) * viewport.zoom + viewport.panY - 10;
  const width = Math.abs(to.x - from.x) * viewport.zoom + 20;
  const height = Math.abs(to.y - from.y) * viewport.zoom + 20;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={10} fill={secondary ? 'rgba(45,212,191,0.04)' : 'rgba(45,212,191,0.08)'} stroke="#5eead4" strokeDasharray="6 4" />
      <rect x={x - 3} y={y - 3} width={width + 6} height={height + 6} rx={12} fill="none" stroke={secondary ? 'rgba(94,234,212,0.12)' : 'rgba(94,234,212,0.25)'} />
      {target.label ? <text x={x + 8} y={y - 8} fill="#ccfbf1" fontSize="11">{target.label}</text> : null}
    </g>
  );
};

const PanelCallout = ({ label }: { label: string }): React.JSX.Element => (
  <div className="pointer-events-none absolute right-5 top-16 rounded-lg border border-cyan-300/40 bg-slate-950/80 px-3 py-1 text-[11px] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
    {label}
  </div>
);

export const GuidedOverlay = (): React.JSX.Element | null => {
  const run = useLessonRunStore((state) => state.activeRun);
  if (!run || run.supportLevel === 'sandbox' || !run.highlightedTargets.length) {
    return null;
  }

  const [primaryTarget, secondaryTarget] = run.highlightedTargets;
  const panelTarget = run.highlightedTargets.find((target) => target.type === 'panel-control');

  return (
    <>
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {[primaryTarget, secondaryTarget].filter((target): target is LessonOverlayTarget => Boolean(target)).map((target, index) => {
          const secondary = index > 0;
          if (target.type === 'breadboard-zone') {
            return <ZoneTarget key={target.id} target={target} secondary={secondary} />;
          }
          if (target.type === 'breadboard-hole' || target.type === 'wire-start' || target.type === 'wire-end' || target.type === 'node') {
            return <HoleTarget key={target.id} target={target} secondary={secondary} />;
          }
          return null;
        })}
      </svg>
      {panelTarget?.label ? <PanelCallout label={panelTarget.label} /> : null}
    </>
  );
};
