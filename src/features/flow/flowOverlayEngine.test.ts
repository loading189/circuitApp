import { describe, expect, it } from 'vitest';
import { computeFlowWireStates } from './flowOverlayEngine';

describe('flow overlay engine', () => {
  it('marks a wire active when there is measurable drop', () => {
    const result = computeFlowWireStates(
      [{ id: 'w1', startHoleId: 'n1', endHoleId: 'n2', color: 'blue', style: 'jumper-curved' }],
      { timestampMs: 0, nodeVoltages: { n1: 5, n2: 0 }, supplyCurrentMa: 3 },
    );

    expect(result[0]?.state).toBe('active');
    expect(result[0]?.forward).toBe(true);
  });
});
