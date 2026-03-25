import type { LessonInspectTargetCircuitPayload } from '@/features/lessons/lessonBlueprintTypes';

interface TargetCircuitPreviewProps {
  payload: LessonInspectTargetCircuitPayload;
}

export const TargetCircuitPreview = ({ payload }: TargetCircuitPreviewProps): React.JSX.Element => (
  <div className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 p-2">
    <p className="text-[10px] uppercase tracking-[0.1em] text-cyan-200">Preflight · target loop</p>
    <p className="mt-1 text-[11px] text-token-secondary">{payload.summary}</p>
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-cyan-50/90">
      {payload.pathOrder.map((item, index) => (
        <span key={item} className="inline-flex items-center gap-1">
          <span className="rounded border border-cyan-300/30 bg-slate-950/30 px-1.5 py-0.5">{item}</span>
          {index < payload.pathOrder.length - 1 ? <span className="opacity-70">→</span> : null}
        </span>
      ))}
    </div>
  </div>
);
