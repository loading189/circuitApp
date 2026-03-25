import { describe, expect, it } from 'vitest';
import { resolveStepOverlayTargets } from './lessonGuidanceEngine';
import { lessonRegistry } from './lessonRegistry';

describe('lesson guidance overlay targets', () => {
  it('keeps exact wire targets in guided mode for LED lesson', () => {
    const lesson = lessonRegistry.getById('lesson-led-current-limiter');
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const stepIndex = lesson.steps.findIndex((step) => step.id === 'led-wire-supply');
    const targets = resolveStepOverlayTargets(lesson, stepIndex, 'guided');

    expect(targets.some((target) => target.type === 'wire-start')).toBe(true);
    expect(targets.some((target) => target.type === 'wire-end')).toBe(true);
  });

  it('removes exact hole/wire targets in coached mode', () => {
    const lesson = lessonRegistry.getById('lesson-led-current-limiter');
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    const stepIndex = lesson.steps.findIndex((step) => step.id === 'led-wire-supply');
    const targets = resolveStepOverlayTargets(lesson, stepIndex, 'coached');

    expect(targets.some((target) => target.type === 'wire-start' || target.type === 'wire-end' || target.type === 'breadboard-hole')).toBe(false);
  });
});
