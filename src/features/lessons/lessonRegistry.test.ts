import { describe, expect, it } from 'vitest';
import { lessonRegistry } from './lessonRegistry';

describe('lesson registry', () => {
  it('includes the first three polished foundations lessons', () => {
    expect(lessonRegistry.getById('lesson-led-current-limiter')).toBeTruthy();
    expect(lessonRegistry.getById('lesson-voltage-divider')).toBeTruthy();
    expect(lessonRegistry.getById('lesson-rc-charge')).toBeTruthy();
  });

  it('resolves lessons by slug', () => {
    const lesson = lessonRegistry.getBySlug('voltage-divider');
    expect(lesson?.id).toBe('lesson-voltage-divider');
  });

  it('keeps LED guided golden-path content intact', () => {
    const lesson = lessonRegistry.getById('lesson-led-current-limiter');
    expect(lesson).toBeTruthy();
    if (!lesson) return;

    expect(lesson.steps.map((step) => step.id)).toEqual([
      'led-inspect-target',
      'led-place-resistor',
      'led-place-led',
      'led-wire-supply',
      'led-wire-series-link',
      'led-wire-return',
      'led-run',
      'led-break',
      'led-compare',
      'led-complete',
    ]);
    expect(lesson.breakExperiments).toHaveLength(1);
    expect(lesson.tutorPromptHints).toContain('Why isn’t my LED turning on?');
  });
});
