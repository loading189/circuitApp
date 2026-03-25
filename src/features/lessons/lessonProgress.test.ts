import { describe, expect, it } from 'vitest';
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
});
