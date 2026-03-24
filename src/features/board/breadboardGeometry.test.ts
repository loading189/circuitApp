import { describe, expect, it } from 'vitest';
import { createDefaultBreadboardGeometry } from './breadboardGeometry';

describe('breadboard geometry', () => {
  it('builds deterministic hole ids and maps', () => {
    const geometry = createDefaultBreadboardGeometry();

    expect(geometry.holes.length).toBeGreaterThan(200);
    expect(geometry.holesById['left-a-1']).toBeDefined();
    expect(geometry.holesById['rail-top-positive-1']).toBeDefined();
    expect(geometry.holesById['right-j-30']).toBeDefined();
  });

  it('keeps strip row groups connected by default net', () => {
    const geometry = createDefaultBreadboardGeometry();
    const leftRow = geometry.stripsByDefaultNet['left-strip-row-12'];

    expect(leftRow).toContain('left-a-12');
    expect(leftRow).toContain('left-e-12');
    expect(leftRow.length).toBe(5);
  });
});
