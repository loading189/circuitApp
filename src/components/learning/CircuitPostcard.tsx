import { useEffect, useRef } from 'react';
import { CircuitPostcardCompact } from './CircuitPostcardCompact';
import { CircuitPostcardExpanded } from './CircuitPostcardExpanded';
import { MicroTeachingToast } from './MicroTeachingToast';
import { useBoardStore } from '@/features/board/boardStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useFlowVisualizationStore } from '@/features/flow/flowVisualizationStore';
import { lessonRegistry } from '@/features/lessons/lessonRegistry';
import { resolveStepGuidance } from '@/features/lessons/lessonGuidanceEngine';
import { evaluateLedGuidedStep } from '@/features/lessons/ledGuidedStepEvaluator';
import { evaluateLessonProgress } from '@/features/lessons/lessonProgress';
import { LESSON_LAUNCH_LEVELS, LESSON_SUPPORT_PROFILES } from '@/features/lessons/lessonSupportProfiles';
import { useLessonRunStore } from '@/features/lessons/lessonRunStore';
import { useLessonStore } from '@/features/lessons/lessonStore';
import { useMicroTeachingStore } from '@/features/lessons/microTeachingStore';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import { useWireStore } from '@/features/wiring/wirePlacement';
import { useTutorStore } from '@/features/tutor/tutorStore';
import { useToolPanelStore } from '@/features/ui/toolPanelStore';

const AUTO_ADVANCE_DELAY_MS = 420;

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
  const showMoment = useMicroTeachingStore((state) => state.showMoment);
  const dismissMoment = useMicroTeachingStore((state) => state.dismissMoment);

  const selectedHoleId = useBoardStore((state) => state.selectedHoleId);
  const components = useComponentPlacementStore((state) => state.components);
  const simulationStatus = useSimulationStore((state) => state.status);
  const flowEnabled = useFlowVisualizationStore((state) => state.enabled);
  const wires = useWireStore((state) => state.wires);
  const sendMessage = useTutorStore((state) => state.sendMessage);
  const run = useLessonRunStore((state) => state.activeRun);
  const setActivePanel = useToolPanelStore((state) => state.setActivePanel);

  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const lastFeedbackStepRef = useRef<string | null>(null);
  const completedStepRef = useRef<string | null>(null);

  const lesson = lessonRegistry.getById(activeLessonId ?? '');
  if (!lesson) {
    return null;
  }

  const progress = evaluateLessonProgress({
    lesson,
    components,
    hasProbeSelection: Boolean(selectedHoleId),
    wires,
    simulationStatus,
    currentStepIndex: activeStepIndex,
    supportLevel: activeSupportLevel,
  });

  useEffect(() => {
    useLessonRunStore.getState().updateProgress(progress);
  }, [progress]);

  const isMinimized = postcardState === 'minimized';
  const isExpanded = postcardState === 'expanded' || postcardState === 'completed';
  const profile = LESSON_SUPPORT_PROFILES[activeSupportLevel];
  const step = lesson.steps[activeStepIndex];
  const stepGuidance = resolveStepGuidance(lesson, activeStepIndex, activeSupportLevel);
  const quickTutorPrompt = `${profile.label} help: ${lesson.tutorPromptHints[0] ?? `Explain this lesson: ${lesson.title}`}`;

  useEffect(() => {
    if (activeSupportLevel !== 'guided' || lesson.id !== 'lesson-led-current-limiter' || !step) {
      return;
    }

    const evaluation = evaluateLedGuidedStep({
      lesson,
      step,
      components,
      wires,
      simulationStatus,
      flowEnabled,
    });

    if (evaluation.state === 'incorrect' && lastFeedbackStepRef.current !== `${step.id}:${evaluation.message}`) {
      showMoment({
        id: `${lesson.id}-${step.id}-feedback`,
        text: evaluation.message,
        stepId: step.id,
        lessonId: lesson.id,
        tone: 'correction',
      });
      lastFeedbackStepRef.current = `${step.id}:${evaluation.message}`;
    }

    if (evaluation.state === 'complete' && completedStepRef.current !== step.id) {
      completedStepRef.current = step.id;
      dismissMoment();
      showMoment({
        id: `${lesson.id}-${step.id}-complete`,
        text: `✓ ${step.title} complete.`,
        stepId: step.id,
        lessonId: lesson.id,
        tone: 'success',
      });

      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }

      autoAdvanceTimerRef.current = window.setTimeout(() => {
        if (step.afterStepTeachingNote) {
          showMoment({
            id: `${lesson.id}-${step.id}-${activeStepIndex}`,
            text: step.afterStepTeachingNote,
            stepId: step.id,
            lessonId: lesson.id,
            tone: 'teaching',
          });
        }
        nextStep();
      }, AUTO_ADVANCE_DELAY_MS);
    }

    if (evaluation.state !== 'complete') {
      completedStepRef.current = null;
    }

    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [activeStepIndex, activeSupportLevel, components, dismissMoment, flowEnabled, lesson, nextStep, showMoment, simulationStatus, step, wires]);

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

  const handleNextStep = (): void => {
    if (step?.afterStepTeachingNote) {
      showMoment({
        id: `${lesson.id}-${step.id}-${activeStepIndex}`,
        text: step.afterStepTeachingNote,
        stepId: step.id,
        lessonId: lesson.id,
        tone: 'teaching',
      });
    }
    nextStep();
  };

  return (
    <article
      className="postcard-floating w-[420px]"
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
      <div className="mt-2">
        <MicroTeachingToast />
      </div>

      <div className="mt-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100">
        {profile.label} mode · {profile.description}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="chip-btn" onClick={previousStep}>Prev step</button>
        <button type="button" className="chip-btn" onClick={handleNextStep}>Next step</button>
        <button type="button" className="chip-btn" onClick={() => sendMessage(quickTutorPrompt)}>Ask tutor</button>
        <button type="button" className="chip-btn" onClick={() => setLibraryMode(activeSupportLevel === 'guided' ? 'required' : 'lesson')}>Lesson parts</button>
        {step?.toolSuggestion ? <button type="button" className="chip-btn" onClick={() => setActivePanel('instruments')}>{step.toolSuggestion}</button> : null}
      </div>

      {isExpanded ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {activeSupportLevel !== 'independent' ? <button type="button" className="chip-btn" onClick={toggleHighlightedOnly}>Highlight lesson components</button> : null}
          <button type="button" className="chip-btn" onClick={requestLessonReset}>Reset board</button>
          <button type="button" className="chip-btn" onClick={() => restartLessonRun()}>Restart</button>
          {LESSON_LAUNCH_LEVELS.map((level) => (
            <button key={level} type="button" className={`chip-btn ${level === activeSupportLevel ? 'chip-btn-active' : ''}`} onClick={() => restartLessonRun(level)}>
              Restart as {LESSON_SUPPORT_PROFILES[level].label}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-2 text-[10px] text-token-secondary">Replay count: {run?.retryCount ?? 0} · Checkpoints: {progress.completedCount}/{progress.totalCount}</p>
    </article>
  );
};
