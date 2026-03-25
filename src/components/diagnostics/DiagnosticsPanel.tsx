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

const lessonDiagnostics = (lessonId: string | undefined): DiagnosticItem[] => {
  if (lessonId === 'lesson-led-current-limiter') {
    return [
      { id: 'led-open', severity: 'warning', title: 'Open return path', detail: 'The LED branch needs a full loop back to ground before current can flow.' },
      { id: 'led-polarity', severity: 'info', title: 'Check LED direction', detail: 'If LED is reversed, flow appears blocked even with correct wiring elsewhere.' },
    ];
  }
  if (lessonId === 'lesson-voltage-divider') {
    return [
      { id: 'div-mid', severity: 'info', title: 'Midpoint depends on ratio', detail: 'The center node only becomes a valid divider output when both resistor legs are connected.' },
      { id: 'div-float', severity: 'warning', title: 'Possible floating midpoint', detail: 'If upper or lower resistor is disconnected, midpoint is not a reliable divider voltage.' },
    ];
  }
  if (lessonId === 'lesson-rc-charge') {
    return [
      { id: 'rc-dynamic', severity: 'info', title: 'Dynamic node expected', detail: 'Capacitor node should rise over time; instant jump usually means topology/config issue.' },
      { id: 'rc-path', severity: 'warning', title: 'Charge path check', detail: 'Missing resistor or incorrect capacitor wiring can remove intended RC time behavior.' },
    ];
  }

  return [
    { id: 'base-ready', severity: 'info', title: 'Workbench ready', detail: 'Place a source, load element, and return path to begin simulation checks.' },
  ];
};

export const DiagnosticsPanel = (): React.JSX.Element => {
  const [openId, setOpenId] = useState<string | null>('d2');
  const setSelectedHole = useBoardStore((state) => state.setSelectedHole);
  const lessonContext = getActiveLessonContext();
  const diagnostics = lessonDiagnostics(lessonContext?.lessonId);

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
