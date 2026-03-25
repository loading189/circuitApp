import { useBoardStore } from '@/features/board/boardStore';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { getActiveLessonContext } from '@/features/lessons/lessonContextAdapter';
import { useSimulationStore } from '@/features/simulation/simulationStore';
import { componentRegistry } from '@/features/components/componentRegistry';
import { useWireStore } from '@/features/wiring/wirePlacement';
import { buildTutorSupportInstruction } from '@/features/lessons/lessonTutorAdapter';
import { useLabUiStore } from '@/features/ui/labUiStore';
import type { TutorContextPayload, TutorMessage } from './tutorTypes';

export const buildTutorContextPayload = (userMessage: string, conversation: TutorMessage[]): TutorContextPayload => {
  const mode = useLabUiStore.getState().mode;
  const activeLesson = useLabUiStore.getState().activeLessonTitle;
  const components = useComponentPlacementStore.getState().components;
  const selectedComponentId = useSelectionStore.getState().selectedComponentId;
  const selectedHoleId = useBoardStore.getState().selectedHoleId;
  const simulation = useSimulationStore.getState();
  const wires = useWireStore.getState().wires;
  const lessonContext = getActiveLessonContext();

  return {
    mode,
    activeLesson: lessonContext?.lessonTitle ?? activeLesson,
    lessonObjectives: lessonContext?.expectedObservations ?? ['Complete closed loop', 'Apply resistor current limiting', 'Verify LED polarity'],
    currentStep: lessonContext?.currentStepLabel ?? 'Build path from + rail to GND through resistor and LED',
    componentInventory: components.map((component) => ({
      id: component.id,
      type: component.type,
      terminals: component.terminals.map((terminal) => terminal.holeId),
    })),
    selectedEntity: {
      componentId: selectedComponentId ?? undefined,
      nodeId: selectedHoleId ?? undefined,
    },
    wireSummary: `${wires.length} wires placed.`,
    simulationState: simulation.status,
    nodeVoltages: simulation.snapshot.nodeVoltages,
    componentStateSummaries: components.map((component) => {
      const definition = componentRegistry.getByType(component.type);
      return `${component.name}: ${definition.displayName} (${definition.simulationSupport}) at ${component.terminals.map((terminal) => terminal.holeId).join(', ')}`;
    }),
    diagnostics: [
      'Deterministic diagnostics available in Diagnostics tab.',
      ...(lessonContext
        ? [
            `Lesson context: ${lessonContext.progressLabel}. Common mistake: ${lessonContext.commonMistakes[0] ?? 'none'}.`,
            buildTutorSupportInstruction(lessonContext.supportLevel),
          ]
        : []),
    ],
    recentUserChanges: useComponentPlacementStore
      .getState()
      .components.slice(-3)
      .map((component) => `Placed ${component.type} (${component.id.slice(0, 6)})`),
    recentProbeActions: selectedHoleId ? [`Selected node ${selectedHoleId}`] : [],
    userMessage,
    conversation,
  };
};
