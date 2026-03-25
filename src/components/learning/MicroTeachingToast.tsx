import { useEffect } from 'react';
import { useMicroTeachingStore } from '@/features/lessons/microTeachingStore';

const AUTO_HIDE_MS = 5000;

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

  return (
    <div className="pointer-events-auto rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <p>{activeMoment.text}</p>
        <button type="button" className="text-[10px] uppercase tracking-[0.08em] text-emerald-200/80 hover:text-emerald-100" onClick={dismissMoment}>
          Dismiss
        </button>
      </div>
    </div>
  );
};
