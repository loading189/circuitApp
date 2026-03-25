import type { LessonInspectTargetCircuitPayload } from '@/features/lessons/lessonBlueprintTypes';

interface TargetCircuitPreviewProps {
  payload: LessonInspectTargetCircuitPayload;
}

export const TargetCircuitPreview = ({ payload }: TargetCircuitPreviewProps): React.JSX.Element => (
  <div className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 p-2">
    <p className="text-[10px] uppercase tracking-[0.1em] text-cyan-200">Target path</p>
    <p className="mt-1 text-[11px] text-token-secondary">{payload.summary}</p>
    <ol className="mt-2 list-decimal space-y-0.5 pl-4 text-[11px] text-cyan-50/90">
      {payload.pathOrder.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  </div>
);
