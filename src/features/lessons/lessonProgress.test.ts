import { describe, expect, it } from 'vitest';
import type { PlacedComponent } from '@/features/components/componentTypes';
import { evaluateLessonProgress } from './lessonProgress';
import { lessonRegistry } from './lessonRegistry';

describe('lesson progress', () => {
  it('requires duplicated component counts when lesson asks for two resistors', () => {
    const lesson = lessonRegistry.getById('lesson-voltage-divider');
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const progress = evaluateLessonProgress({
      lesson,
      components: [
        { id: 's', type: 'battery-source', name: 'V1', rotation: 0, terminals: [], props: {} },
        { id: 'r1', type: 'resistor', name: 'R1', rotation: 0, terminals: [], props: {} },
      ],
      hasProbeSelection: false,
      wires: [],
      simulationStatus: 'stopped',
      currentStepIndex: 0,
      supportLevel: 'guided',
    });

    expect(progress.completedCheckpointIds).not.toContain('cp-div-components');
  });

  it('keeps legacy topology progression in coached mode', () => {
    const lesson = lessonRegistry.getById('lesson-led-current-limiter');
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const components: PlacedComponent[] = [
      { id: 's', type: 'battery-source', name: 'V1', rotation: 0, terminals: [], props: {} },
      { id: 'r1', type: 'resistor', name: 'R1', rotation: 0, terminals: [], props: {} },
      { id: 'd1', type: 'led', name: 'LED1', rotation: 0, terminals: [], props: {} },
    ];

    const returnProgress = evaluateLessonProgress({
      lesson,
      components,
      hasProbeSelection: false,
      wires: [],
      simulationStatus: 'running',
      currentStepIndex: lesson.steps.findIndex((step) => step.id === 'led-wire-return'),
      supportLevel: 'coached',
    });

    expect(returnProgress.completedCheckpointIds).toContain('cp-led-topology');
  });
});
