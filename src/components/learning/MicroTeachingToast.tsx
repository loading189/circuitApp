import { useEffect } from 'react';
import { useMicroTeachingStore } from '@/features/lessons/microTeachingStore';

const AUTO_HIDE_MS = 5000;

const toneClasses: Record<'teaching' | 'success' | 'correction', string> = {
  teaching: 'border-emerald-400/35 bg-emerald-500/10 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
  success: 'border-cyan-300/40 bg-cyan-500/10 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.2)]',
  correction: 'border-amber-300/35 bg-amber-500/10 text-amber-50 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
};

export const MicroTeachingToast = (): React.JSX.Element | null => {
  const activeMoment = useMicroTeachingStore((state) => state.activeMoment);
  const dismissMoment = useMicroTeachingStore((state) => state.dismissMoment);

  useEffect(() => {
    if (!activeMoment) {
      return;
    }

    const timeout = window.setTimeout(() => {
      dismissMoment();
    }, AUTO_HIDE_MS);

    return () => window.clearTimeout(timeout);
  }, [activeMoment, dismissMoment]);

  if (!activeMoment) {
    return null;
  }

  const tone = activeMoment.tone ?? 'teaching';

  return (
    <div className={`pointer-events-auto rounded-lg border px-3 py-2 text-xs ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <p>{activeMoment.text}</p>
        <button type="button" className="text-[10px] uppercase tracking-[0.08em] opacity-80 hover:opacity-100" onClick={dismissMoment}>
          Dismiss
        </button>
      </div>
    </div>
  );
};
