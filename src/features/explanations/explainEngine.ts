import { componentRegistry } from '@/features/components/componentRegistry';
import type { PlacedComponent } from '@/features/components/componentTypes';
import type { SimulationSnapshot } from '@/features/simulation/simulationTypes';
import { useLessonStore } from '@/features/lessons/lessonStore';

interface ExplainInput {
  selectedComponent: PlacedComponent | null;
  selectedHoleId: string | null;
  snapshot: SimulationSnapshot;
}

export interface ExplainResult {
  title: string;
  whatIsThis: string;
  whatDoingHere: string;
  currentCondition: string;
  whyItMatters: string;
}

const explainComponent = (component: PlacedComponent, snapshot: SimulationSnapshot): ExplainResult => {
  const definition = componentRegistry.getByType(component.type);

  return {
    title: `${component.name} · ${definition.displayName}`,
    whatIsThis: definition.learning.plainExplanation,
    whatDoingHere: definition.learning.commonUses.join(', '),
    currentCondition: `Simulation time ${snapshot.timestampMs} ms. Connected at ${component.terminals.map((t) => t.holeId).join(' → ')}.`,
    whyItMatters: definition.learning.commonMistakes.length
      ? `Watch for: ${definition.learning.commonMistakes.join('; ')}.`
      : 'Correct orientation and pin mapping are important.',
  };
};

const lessonHintFor = (componentType: string, lessonId: string | null): string | null => {
  if (lessonId === 'lesson-led-current-limiter' && componentType === 'led') {
    return 'In this lesson, the LED lights only when it is forward-biased and the loop is closed through the series resistor.';
  }
  if (lessonId === 'lesson-led-current-limiter' && componentType === 'resistor') {
    return 'This resistor is the current limiter; it must remain in series with the LED to keep current in a safe range.';
  }
  if (lessonId === 'lesson-voltage-divider' && componentType === 'resistor') {
    return 'In divider mode, each resistor helps set midpoint voltage ratio between supply and ground.';
  }
  if (lessonId === 'lesson-rc-charge' && (componentType === 'capacitor' || componentType === 'ceramic-capacitor' || componentType === 'electrolytic-capacitor')) {
    return 'This capacitor creates time behavior: its node voltage rises gradually, not instantly.';
  }
  return null;
};

export const explainSelection = ({ selectedComponent, selectedHoleId, snapshot }: ExplainInput): ExplainResult => {
  const lessonId = useLessonStore.getState().activeLessonId;
  if (selectedComponent) {
    const base = explainComponent(selectedComponent, snapshot);
    return {
      ...base,
      whyItMatters: lessonHintFor(selectedComponent.type, lessonId) ?? base.whyItMatters,
    };
  }

  if (selectedHoleId) {
    const voltage = snapshot.nodeVoltages[selectedHoleId];
    const lessonNodeHint =
      lessonId === 'lesson-voltage-divider'
        ? 'If this is between two resistors, its voltage depends on their ratio.'
        : lessonId === 'lesson-rc-charge'
          ? 'For RC charging, this node should move over time instead of staying static.'
          : lessonId === 'lesson-led-current-limiter'
            ? 'In LED current limiting, this node only participates in active flow when the loop and LED polarity are both correct.'
            : null;
    return {
      title: `Node ${selectedHoleId}`,
      whatIsThis: 'A breadboard electrical node that can be shared by several terminals.',
      whatDoingHere: 'It links nearby component pins into a net for current flow.',
      currentCondition: `Measured voltage: ${voltage !== undefined ? `${voltage.toFixed(2)} V` : 'not yet solved'}.`,
      whyItMatters: lessonNodeHint ?? 'Node voltage is the fastest way to verify expected circuit operation.',
    };
  }

  return {
    title: 'Select a component or node',
    whatIsThis: 'Choose something on the board to get a deterministic explanation.',
    whatDoingHere: 'This panel uses simulation and topology state, not AI generation.',
    currentCondition: 'No active selection.',
    whyItMatters: 'Deterministic explanations build trust while learning electronics.',
  };
};
