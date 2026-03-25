import { useRef } from 'react';
import { CircuitPostcardCompact } from './CircuitPostcardCompact';
import { CircuitPostcardExpanded } from './CircuitPostcardExpanded';
import { useBoardStore } from '@/features/board/boardStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { evaluateLessonProgress } from '@/features/lessons/lessonProgress';
import { useLessonStore } from '@/features/lessons/lessonStore';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import { useTutorStore } from '@/features/tutor/tutorStore';

export const CircuitPostcard = (): React.JSX.Element | null => {
  const activeLessonId = useLessonStore((state) => state.activeLessonId);
  const activeStepIndex = useLessonStore((state) => state.activeStepIndex);
  const postcardState = useLessonStore((state) => state.postcardState);
  const postcardPinned = useLessonStore((state) => state.postcardPinned);
  const postcardPosition = useLessonStore((state) => state.postcardPosition);
  const setPostcardPosition = useLessonStore((state) => state.setPostcardPosition);
  const setPostcardPinned = useLessonStore((state) => state.setPostcardPinned);
  const setPostcardState = useLessonStore((state) => state.setPostcardState);
  const setLibraryMode = useLessonStore((state) => state.setLibraryMode);
  const toggleHighlightedOnly = useLessonStore((state) => state.toggleHighlightedOnly);
  const nextStep = useLessonStore((state) => state.nextStep);
  const previousStep = useLessonStore((state) => state.previousStep);
  const requestLessonReset = useLessonStore((state) => state.requestLessonReset);

  const selectedHoleId = useBoardStore((state) => state.selectedHoleId);
  const components = useComponentPlacementStore((state) => state.components);
  const simulationStatus = useSimulationStore((state) => state.status);
  const sendMessage = useTutorStore((state) => state.sendMessage);

  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const lesson = lessonRegistry.getById(activeLessonId ?? '');
  if (!lesson) {
    return null;
  }

  const progress = evaluateLessonProgress({
    lesson,
    components,
    hasProbeSelection: Boolean(selectedHoleId),
    simulationStatus,
    currentStepIndex: activeStepIndex,
  });

  const isMinimized = postcardState === 'minimized';
  const isExpanded = postcardState === 'expanded' || postcardState === 'completed';
  const quickTutorPrompt = lesson.tutorPromptHints[0] ?? `Explain this lesson: ${lesson.title}`;

  if (isMinimized) {
    return (
      <button
        type="button"
        className="postcard-floating w-56 text-left"
        style={{ left: postcardPosition.x, top: postcardPosition.y }}
        onClick={() => setPostcardState('compact')}
      >
        Open lesson postcard
      </button>
    );
  }

  return (
    <article
      className="postcard-floating w-[390px]"
      style={{ left: postcardPosition.x, top: postcardPosition.y }}
      onPointerDown={(event) => {
        if (postcardPinned) {
          return;
        }
        dragRef.current = { x: event.clientX - postcardPosition.x, y: event.clientY - postcardPosition.y };
      }}
      onPointerMove={(event) => {
        if (!dragRef.current || postcardPinned) {
          return;
        }
        setPostcardPosition({ x: Math.max(8, event.clientX - dragRef.current.x), y: Math.max(80, event.clientY - dragRef.current.y) });
      }}
      onPointerUp={() => {
        dragRef.current = null;
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <CircuitPostcardCompact lesson={lesson} stepIndex={activeStepIndex} totalSteps={lesson.steps.length} />
        <div className="flex flex-wrap justify-end gap-1">
          <button type="button" className={`chip-btn ${postcardPinned ? 'chip-btn-active' : ''}`} onClick={() => setPostcardPinned(!postcardPinned)}>{postcardPinned ? 'Unpin' : 'Pin'}</button>
          <button type="button" className="chip-btn" onClick={() => setPostcardState(isExpanded ? 'compact' : 'expanded')}>{isExpanded ? 'Compact' : 'Expand'}</button>
          <button type="button" className="chip-btn" onClick={() => setPostcardState('minimized')}>Minimize</button>
        </div>
      </div>

      <CircuitPostcardExpanded lesson={lesson} stepIndex={activeStepIndex} progress={progress} expanded={isExpanded} />

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="chip-btn" onClick={previousStep}>Prev step</button>
        <button type="button" className="chip-btn" onClick={nextStep}>Next step</button>
        <button type="button" className="chip-btn" onClick={() => sendMessage(quickTutorPrompt)}>Ask tutor</button>
        <button type="button" className="chip-btn" onClick={() => setLibraryMode('required')}>Show required parts only</button>
        <button type="button" className="chip-btn" onClick={toggleHighlightedOnly}>Highlight lesson components</button>
        <button type="button" className="chip-btn" onClick={requestLessonReset}>Reset lesson board</button>
      </div>
    </article>
  );
};
