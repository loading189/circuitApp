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
});
