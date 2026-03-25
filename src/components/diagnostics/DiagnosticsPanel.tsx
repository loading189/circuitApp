import { useState } from 'react';
import { useBoardStore } from '@/features/board/boardStore';
import { getActiveLessonContext } from '@/features/lessons/lessonContextAdapter';

interface DiagnosticItem {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  detail: string;
  focusNode?: string;
}

const diagnostics: DiagnosticItem[] = [
  {
    id: 'd1',
    severity: 'info',
    title: 'Workbench ready',
    detail: 'Place a source, load element, and return path to begin simulation checks.',
  },
  {
    id: 'd2',
    severity: 'warning',
    title: 'Open return path suspected',
    detail: 'LED branch appears incomplete. Verify cathode path reaches ground rail.',
    focusNode: 'B-12',
  },
];

export const DiagnosticsPanel = (): JSX.Element => {
  const [openId, setOpenId] = useState<string | null>('d2');
  const setSelectedHole = useBoardStore((state) => state.setSelectedHole);
  const lessonContext = getActiveLessonContext();

  return (
    <section className="rail-panel">
      <h3 className="panel-title">Diagnostics</h3>
      {lessonContext ? <p className="mb-2 text-[11px] text-token-secondary">Lesson-aware focus: {lessonContext.currentStepLabel}</p> : null}
      <ul className="space-y-2 text-xs">
        {diagnostics.map((item) => (
          <li key={item.id} className="rounded-lg border border-token-soft bg-token-elevated/70 p-2">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-left"
              onClick={() => {
                setOpenId((prev) => (prev === item.id ? null : item.id));
                if (item.focusNode) {
                  setSelectedHole(item.focusNode);
                }
              }}
            >
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${item.severity}-badge`}>{item.severity}</span>
              <span className="flex-1 text-token-primary">{item.title}</span>
            </button>
            {openId === item.id ? <p className="mt-2 text-token-secondary">{item.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
