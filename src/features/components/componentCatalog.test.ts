import { describe, expect, it } from 'vitest';
import { componentRegistry } from './componentRegistry';
import { resolveComponentPreview } from './componentPreviewRegistry';
import { searchComponents } from './componentSearch';

describe('component catalog utilities', () => {
  it('finds LED by search tokens', () => {
    const results = searchComponents(componentRegistry.all, {
      query: 'light diode',
      category: 'all',
      supportTier: 'all',
      beginnerOnly: false,
    });
    expect(results.some((item) => item.type === 'led')).toBe(true);
  });

  it('resolves mapped preview for resistor', () => {
    const preview = resolveComponentPreview({
      id: 'r1',
      type: 'resistor',
      name: 'R1',
      rotation: 0,
      terminals: [],
      props: { resistanceOhms: 1000 },
    });

    expect(preview.status).toBe('mapped');
  });
});
