import { useLabUiStore } from '@/features/ui/labUiStore';
import { cn } from '@/lib/utils/cn';

export const ModeSwitcher = (): React.JSX.Element => {
  const mode = useLabUiStore((state) => state.mode);
  const setMode = useLabUiStore((state) => state.setMode);

  return (
    <div className="inline-flex rounded-lg border border-token-strong bg-token-elevated p-1">
      {[
        { id: 'free', label: 'Free Lab' },
        { id: 'guided', label: 'Guided Lab' },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setMode(option.id as 'free' | 'guided')}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-semibold tracking-wide transition',
            mode === option.id ? 'bg-accent/20 text-accent shadow-glow-subtle' : 'text-token-secondary hover:text-token-primary',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
