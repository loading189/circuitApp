import type { PlacedComponent } from '@/features/components/componentTypes';
import type { SimulationStatus } from '@/features/simulation/simulationTypes';
import type { Wire } from '@/features/wiring/wireTypes';
import type { LessonDefinition, LessonStep } from './lessonTypes';
import { isBlueprintComponentPlaced, isBlueprintConnectionSatisfied } from './lessonBlueprintValidation';

export type GuidedStepEvaluation =
  | { state: 'complete' }
  | { state: 'incomplete' }
  | { state: 'incorrect'; message: string };

const LED_LESSON_ID = 'lesson-led-current-limiter';

const findPlacedByType = (components: PlacedComponent[], type: string): PlacedComponent | null =>
  components.find((component) => component.type === type) ?? null;

const hasWireTouching = (wires: Wire[], holeId: string): boolean =>
  wires.some((wire) => wire.startHoleId === holeId || wire.endHoleId === holeId);

const hasWireWithEndpoint = (wires: Wire[], endpointHoleId: string): boolean =>
  wires.some((wire) => wire.startHoleId === endpointHoleId || wire.endHoleId === endpointHoleId);

const isLedReversed = (components: PlacedComponent[]): boolean => {
  const led = findPlacedByType(components, 'led');
  if (!led) {
    return false;
  }

  const anode = led.terminals.find((terminal) => terminal.id === 'anode')?.holeId;
  const cathode = led.terminals.find((terminal) => terminal.id === 'cathode')?.holeId;
  return anode === 'left-h-10' && cathode === 'left-d-10';
};

const evaluatePlacementStep = (
  step: LessonStep,
  lesson: LessonDefinition,
  components: PlacedComponent[],
): GuidedStepEvaluation => {
  const componentId = step.blueprintTargets?.componentIds?.[0];
  if (!lesson.blueprint || !componentId) {
    return { state: 'incomplete' };
  }

  if (isBlueprintComponentPlaced(lesson.blueprint, componentId, components)) {
    return { state: 'complete' };
  }

  if (step.id === 'led-place-resistor') {
    const resistor = findPlacedByType(components, 'resistor');
    if (!resistor) {
      return { state: 'incomplete' };
    }
    return { state: 'incorrect', message: 'This resistor needs to span the highlighted holes.' };
  }

  if (step.id === 'led-place-led') {
    const led = findPlacedByType(components, 'led');
    if (!led) {
      return { state: 'incomplete' };
    }
    if (isLedReversed(components)) {
      return { state: 'incorrect', message: 'Try rotating the LED so it matches the highlighted orientation.' };
    }
    return { state: 'incorrect', message: 'Place the LED legs on the highlighted holes.' };
  }

  return { state: 'incomplete' };
};

const evaluateWireStep = (
  step: LessonStep,
  lesson: LessonDefinition,
  components: PlacedComponent[],
  wires: Wire[],
): GuidedStepEvaluation => {
  const connectionId = step.blueprintTargets?.connectionIds?.[0];
  if (!lesson.blueprint || !connectionId) {
    return { state: 'incomplete' };
  }

  if (isBlueprintConnectionSatisfied(lesson.blueprint, connectionId, wires)) {
    return { state: 'complete' };
  }

  if (step.id === 'led-wire-supply' && hasWireWithEndpoint(wires, 'rail-top-positive-6')) {
    return { state: 'incorrect', message: 'This connection should end at the resistor input highlight.' };
  }

  if (step.id === 'led-wire-series-link' && hasWireTouching(wires, 'left-g-8')) {
    return { state: 'incorrect', message: 'Connect resistor output directly to the LED anode highlight.' };
  }

  if (step.id === 'led-wire-return' && hasWireTouching(wires, 'left-h-10')) {
    return { state: 'incorrect', message: 'Return this wire to the highlighted ground rail hole.' };
  }

  return { state: 'incomplete' };
};

export const evaluateLedGuidedStep = (input: {
  lesson: LessonDefinition;
  step: LessonStep | undefined;
  components: PlacedComponent[];
  wires: Wire[];
  simulationStatus: SimulationStatus;
  flowEnabled: boolean;
}): GuidedStepEvaluation => {
  const { lesson, step, components, wires, simulationStatus, flowEnabled } = input;

  if (!step || lesson.id !== LED_LESSON_ID) {
    return { state: 'incomplete' };
  }

  switch (step.id) {
    case 'led-inspect-target':
      return { state: 'complete' };
    case 'led-place-resistor':
    case 'led-place-led':
      return evaluatePlacementStep(step, lesson, components);
    case 'led-wire-supply':
    case 'led-wire-series-link':
    case 'led-wire-return':
      return evaluateWireStep(step, lesson, components, wires);
    case 'led-run':
      return simulationStatus !== 'stopped' && flowEnabled ? { state: 'complete' } : { state: 'incomplete' };
    case 'led-break':
      return isLedReversed(components)
        ? { state: 'complete' }
        : { state: 'incorrect', message: 'Reverse the LED so anode/cathode swap highlighted positions.' };
    case 'led-compare':
      return simulationStatus !== 'stopped' ? { state: 'complete' } : { state: 'incomplete' };
    default:
      return { state: 'incomplete' };
  }
};
