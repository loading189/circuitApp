import { useEffect, useRef } from 'react';
import { CircuitPostcardCompact } from './CircuitPostcardCompact';
import { CircuitPostcardExpanded } from './CircuitPostcardExpanded';
import { useBoardStore } from '@/features/board/boardStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { resolveStepGuidance } from '@/features/lessons/lessonGuidanceEngine';
import { evaluateLessonProgress } from '@/features/lessons/lessonProgress';
import { LESSON_LAUNCH_LEVELS, LESSON_SUPPORT_PROFILES } from '@/features/lessons/lessonSupportProfiles';
import { useLessonRunStore } from '@/features/lessons/lessonRunStore';
import { useLessonStore } from '@/features/lessons/lessonStore';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import { useTutorStore } from '@/features/tutor/tutorStore';

export const CircuitPostcard = (): React.JSX.Element | null => {
  const activeLessonId = useLessonStore((state) => state.activeLessonId);
  const activeStepIndex = useLessonStore((state) => state.activeStepIndex);
  const activeSupportLevel = useLessonStore((state) => state.activeSupportLevel);
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
  const restartLessonRun = useLessonStore((state) => state.restartLessonRun);

  const selectedHoleId = useBoardStore((state) => state.selectedHoleId);
  const components = useComponentPlacementStore((state) => state.components);
  const simulationStatus = useSimulationStore((state) => state.status);
  const sendMessage = useTutorStore((state) => state.sendMessage);
  const run = useLessonRunStore((state) => state.activeRun);

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


  useEffect(() => {
    useLessonRunStore.getState().updateProgress(progress);
  }, [progress]);

  const isMinimized = postcardState === 'minimized';
  const isExpanded = postcardState === 'expanded' || postcardState === 'completed';
  const profile = LESSON_SUPPORT_PROFILES[activeSupportLevel];
  const stepGuidance = resolveStepGuidance(lesson, activeStepIndex, activeSupportLevel);
  const quickTutorPrompt = `${profile.label} help: ${lesson.tutorPromptHints[0] ?? `Explain this lesson: ${lesson.title}`}`;

  if (activeSupportLevel === 'sandbox' && postcardState === 'minimized') {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        type="button"
        className="postcard-floating w-56 text-left"
        style={{ left: postcardPosition.x, top: postcardPosition.y }}
        onClick={() => setPostcardState('compact')}
      >
        Open lesson postcard · {profile.label}
      </button>
    );
  }

  return (
    <article
      className="postcard-floating w-[430px]"
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
        <CircuitPostcardCompact lesson={lesson} stepIndex={activeStepIndex} totalSteps={lesson.steps.length} supportLevel={activeSupportLevel} />
        <div className="flex flex-wrap justify-end gap-1">
          <button type="button" className={`chip-btn ${postcardPinned ? 'chip-btn-active' : ''}`} onClick={() => setPostcardPinned(!postcardPinned)}>{postcardPinned ? 'Unpin' : 'Pin'}</button>
          <button type="button" className="chip-btn" onClick={() => setPostcardState(isExpanded ? 'compact' : 'expanded')}>{isExpanded ? 'Compact' : 'Expand'}</button>
          <button type="button" className="chip-btn" onClick={() => setPostcardState('minimized')}>Minimize</button>
        </div>
      </div>

      <CircuitPostcardExpanded lesson={lesson} stepIndex={activeStepIndex} progress={progress} expanded={isExpanded} supportLevel={activeSupportLevel} guidance={stepGuidance} />

      <div className="mt-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100">
        {profile.label} mode · {profile.description}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="chip-btn" onClick={previousStep}>Prev step</button>
        <button type="button" className="chip-btn" onClick={nextStep}>Next step</button>
        <button type="button" className="chip-btn" onClick={() => sendMessage(quickTutorPrompt)}>Ask tutor</button>
        <button type="button" className="chip-btn" onClick={() => setLibraryMode(activeSupportLevel === 'guided' ? 'required' : 'lesson')}>Required parts</button>
        {activeSupportLevel !== 'independent' ? <button type="button" className="chip-btn" onClick={toggleHighlightedOnly}>Highlight lesson components</button> : null}
        <button type="button" className="chip-btn" onClick={requestLessonReset}>Reset board</button>
        <button type="button" className="chip-btn" onClick={() => restartLessonRun()}>Restart</button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {LESSON_LAUNCH_LEVELS.map((level) => (
          <button key={level} type="button" className={`chip-btn ${level === activeSupportLevel ? 'chip-btn-active' : ''}`} onClick={() => restartLessonRun(level)}>
            Restart as {LESSON_SUPPORT_PROFILES[level].label}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[10px] text-token-secondary">Replay count: {run?.retryCount ?? 0} · Checkpoints: {progress.completedCount}/{progress.totalCount}</p>
    </article>
  );
};
