import { useMemo } from 'react';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import type { ComponentType } from '@/features/components/componentTypes';
import { componentRegistry } from '@/features/components/componentRegistry';
import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { useLessonRunStore } from '@/features/lessons/lessonRunStore';
import { useLessonStore } from '@/features/lessons/lessonStore';

const statusChipClass: Record<'placed' | 'next' | 'required' | 'optional', string> = {
  placed: 'text-emerald-200 bg-emerald-500/20 border-emerald-400/40',
  next: 'text-cyan-100 bg-cyan-500/20 border-cyan-300/55',
  required: 'text-slate-200 bg-slate-500/20 border-slate-400/40',
  optional: 'text-sky-100 bg-sky-500/20 border-sky-300/45',
};

export const LessonPartsPanel = (): React.JSX.Element | null => {
  const activeLessonId = useLessonStore((state) => state.activeLessonId);
  const activeSupportLevel = useLessonStore((state) => state.activeSupportLevel);
  const activeStepIndex = useLessonStore((state) => state.activeStepIndex);
  const setLibraryMode = useLessonStore((state) => state.setLibraryMode);
  const setPlacingType = useComponentPlacementStore((state) => state.setPlacingType);
  const placingType = useComponentPlacementStore((state) => state.placingType);
  const components = useComponentPlacementStore((state) => state.components);
  const setToolMode = useSelectionStore((state) => state.setToolMode);
  const run = useLessonRunStore((state) => state.activeRun);

  const lesson = lessonRegistry.getById(activeLessonId ?? '');

  const nextTargetType = useMemo(() => {
    return run?.highlightedTargets.find((target) => target.type === 'component-library-item')?.componentType ?? null;
  }, [run?.highlightedTargets]);

  const requiredParts = useMemo(() => {
    if (!lesson) {
      return [];
    }
    return lesson.requiredComponents
      .map((componentType) => componentRegistry.getByType(componentType as ComponentType))
      .filter((value): value is NonNullable<typeof value> => Boolean(value));
  }, [lesson]);

  const optionalParts = useMemo(() => {
    if (!lesson) {
      return [];
    }
    return lesson.optionalComponents
      .map((componentType) => componentRegistry.getByType(componentType as ComponentType))
      .filter((value): value is NonNullable<typeof value> => Boolean(value));
  }, [lesson]);

  if (!lesson) {
    return null;
  }

  const activeStep = lesson.steps[activeStepIndex];
  const componentPlacementPhase = activeStep?.id === 'led-place-resistor' || activeStep?.id === 'led-place-led';

  const renderTile = (type: 'required' | 'optional', componentType: ComponentType): React.JSX.Element | null => {
    const definition = componentRegistry.getByType(componentType);
    if (!definition) {
      return null;
    }

    const placedCount = components.filter((item) => item.type === componentType).length;
    const isPlaced = placedCount > 0;
    const isNext = activeSupportLevel === 'guided' && nextTargetType === componentType;
    const isActive = placingType === componentType;
    const chipTone = isPlaced ? 'placed' : isNext ? 'next' : type;

    return (
      <button
        key={componentType}
        type="button"
        onClick={() => {
          setToolMode('place-component');
          setPlacingType(componentType);
        }}
        className={`component-tile ${isActive ? 'component-tile-active' : ''} ${isNext ? 'ring-2 ring-cyan-300/70 shadow-glow-subtle' : ''}`}
      >
        <span className="icon-pill">{definition.visual2D.icon}</span>
        <span className="flex-1 text-left">
          <span className="block text-xs font-medium text-token-primary">{definition.displayName}</span>
          <span className="block text-[11px] text-token-secondary">{definition.learning.plainExplanation}</span>
        </span>
        <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] ${statusChipClass[chipTone]}`}>
          {isPlaced ? `Placed ${placedCount}` : isNext ? 'Next' : type}
        </span>
      </button>
    );
  };

  return (
    <section className="mt-3 min-h-0 flex-1 overflow-hidden rounded-lg border border-token-soft bg-token-elevated/60 p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="panel-title">Lesson Parts</p>
          <p className="text-[11px] text-token-secondary">{componentPlacementPhase ? 'Select the highlighted part, then place it on highlighted holes.' : 'Parts are ready. Focus on highlighted wire endpoints and flow checks.'}</p>
        </div>
        <button type="button" className="chip-btn opacity-70" onClick={() => setLibraryMode('full')}>
          Show full library
        </button>
      </div>

      <div className="space-y-2 overflow-auto pr-1">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.1em] text-token-secondary">Required</p>
          {requiredParts.map((item) => renderTile('required', item.type))}
        </div>
        {optionalParts.length ? (
          <details className="rounded border border-token-soft/70 bg-token-elevated/40 p-1.5">
            <summary className="cursor-pointer text-[10px] uppercase tracking-[0.1em] text-token-secondary">Optional (when needed)</summary>
            <div className="mt-1 space-y-1">{optionalParts.map((item) => renderTile('optional', item.type))}</div>
          </details>
        ) : null}
      </div>
    </section>
  );
};
