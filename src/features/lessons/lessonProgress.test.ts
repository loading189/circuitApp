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
      simulationStatus: 'stopped',
      currentStepIndex: 0,
    });

    expect(progress.completedCheckpointIds).not.toContain('cp-div-components');
  });

  it('does not mark LED topology checkpoint before return path step', () => {
    const lesson = lessonRegistry.getById('lesson-led-current-limiter');
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const components: PlacedComponent[] = [
      { id: 's', type: 'battery-source', name: 'V1', rotation: 0, terminals: [], props: {} },
      { id: 'r1', type: 'resistor', name: 'R1', rotation: 0, terminals: [], props: {} },
      { id: 'd1', type: 'led', name: 'LED1', rotation: 0, terminals: [], props: {} },
    ];

    const earlyProgress = evaluateLessonProgress({
      lesson,
      components,
      hasProbeSelection: false,
      simulationStatus: 'running',
      currentStepIndex: lesson.steps.findIndex((step) => step.id === 'led-wire-series-link'),
    });

    const returnProgress = evaluateLessonProgress({
      lesson,
      components,
      hasProbeSelection: false,
      simulationStatus: 'running',
      currentStepIndex: lesson.steps.findIndex((step) => step.id === 'led-wire-return'),
    });

    expect(earlyProgress.completedCheckpointIds).not.toContain('cp-led-topology');
    expect(returnProgress.completedCheckpointIds).toContain('cp-led-topology');
  });
});
