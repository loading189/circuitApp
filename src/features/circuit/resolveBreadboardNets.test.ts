import { describe, expect, it } from 'vitest';
import { resolveBreadboardNets } from './resolveBreadboardNets';

describe('resolveBreadboardNets', () => {
  it('connects all row holes by default strips', () => {
    const nets = resolveBreadboardNets();
    const node = Object.values(nets).find((members) => members.includes('left-a-3'));

    expect(node).toContain('left-b-3');
    expect(node).toContain('left-c-3');
    expect(node).not.toContain('right-f-3');
  });

  it('merges separate strips via jumper wire endpoints', () => {
    const nets = resolveBreadboardNets([
      {
        id: 'w1',
        fromHoleId: 'left-a-8',
        toHoleId: 'right-f-8',
        color: '#38bdf8',
      },
    ]);

    const node = Object.values(nets).find((members) => members.includes('left-a-8'));
    expect(node).toContain('right-f-8');
  });
});
