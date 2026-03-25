import { describe, expect, it } from 'vitest';
import type { PlacedComponent } from '@/features/components/componentTypes';
import type { Wire } from '@/features/wiring/wireTypes';
import { lessonRegistry } from './lessonRegistry';
import { evaluateLedGuidedStep } from './ledGuidedStepEvaluator';

const lesson = lessonRegistry.getById('lesson-led-current-limiter');

const buildResistor = (): PlacedComponent => ({
  id: 'r1',
  type: 'resistor',
  name: 'R1',
  rotation: 0,
  props: { resistanceOhms: 330 },
  terminals: [
    { id: 'terminalA', holeId: 'left-b-8' },
    { id: 'terminalB', holeId: 'left-g-8' },
  ],
});

const buildLed = (reversed = false): PlacedComponent => ({
  id: 'd1',
  type: 'led',
  name: 'D1',
  rotation: 0,
  props: { color: 'red' },
  terminals: reversed
    ? [
        { id: 'anode', holeId: 'left-h-10' },
        { id: 'cathode', holeId: 'left-d-10' },
      ]
    : [
        { id: 'anode', holeId: 'left-d-10' },
        { id: 'cathode', holeId: 'left-h-10' },
      ],
});

const wires: Wire[] = [
  { id: 'w1', startHoleId: 'rail-top-positive-6', endHoleId: 'left-b-8', color: 'red', style: 'jumper-curved' },
  { id: 'w2', startHoleId: 'left-g-8', endHoleId: 'left-d-10', color: 'yellow', style: 'jumper-curved' },
  { id: 'w3', startHoleId: 'left-h-10', endHoleId: 'rail-top-negative-8', color: 'black', style: 'jumper-curved' },
];

describe('LED guided step evaluator', () => {
  it('accepts exact resistor placement and rejects wrong holes with calm feedback', () => {
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const step = lesson.steps.find((item) => item.id === 'led-place-resistor');
    const complete = evaluateLedGuidedStep({
      lesson,
      step,
      components: [buildResistor()],
      wires: [],
      simulationStatus: 'stopped',
      flowEnabled: false,
    });
    expect(complete.state).toBe('complete');

    const incorrect = evaluateLedGuidedStep({
      lesson,
      step,
      components: [{ ...buildResistor(), terminals: [{ id: 'terminalA', holeId: 'left-b-9' }, { id: 'terminalB', holeId: 'left-g-9' }] }],
      wires: [],
      simulationStatus: 'stopped',
      flowEnabled: false,
    });
    expect(incorrect).toEqual({ state: 'incorrect', message: 'This resistor needs to span the highlighted holes.' });
  });

  it('requires exact wire endpoints for guided wire steps', () => {
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const step = lesson.steps.find((item) => item.id === 'led-wire-return');
    const complete = evaluateLedGuidedStep({
      lesson,
      step,
      components: [buildResistor(), buildLed()],
      wires,
      simulationStatus: 'stopped',
      flowEnabled: false,
    });
    expect(complete.state).toBe('complete');

    const incorrect = evaluateLedGuidedStep({
      lesson,
      step,
      components: [buildResistor(), buildLed()],
      wires: [{ id: 'w4', startHoleId: 'left-h-10', endHoleId: 'rail-top-negative-7', color: 'black', style: 'jumper-curved' }],
      simulationStatus: 'stopped',
      flowEnabled: false,
    });
    expect(incorrect).toEqual({ state: 'incorrect', message: 'Return this wire to the highlighted ground rail hole.' });
  });

  it('treats LED reversal as break-step completion', () => {
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const step = lesson.steps.find((item) => item.id === 'led-break');
    const beforeBreak = evaluateLedGuidedStep({
      lesson,
      step,
      components: [buildResistor(), buildLed()],
      wires,
      simulationStatus: 'running',
      flowEnabled: true,
    });
    expect(beforeBreak.state).toBe('incorrect');

    const afterBreak = evaluateLedGuidedStep({
      lesson,
      step,
      components: [buildResistor(), buildLed(true)],
      wires,
      simulationStatus: 'running',
      flowEnabled: true,
    });
    expect(afterBreak.state).toBe('complete');
  });
});
