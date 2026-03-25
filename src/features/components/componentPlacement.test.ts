import { describe, expect, it, beforeEach } from 'vitest';
import { useComponentPlacementStore } from './componentPlacement';

describe('component placement store', () => {
  beforeEach(() => {
    useComponentPlacementStore.setState({ placingType: null, components: [] });
  });

  it('places selected component type on a valid hole', () => {
    useComponentPlacementStore.getState().setPlacingType('resistor');
    useComponentPlacementStore.getState().placeComponentAt('left-a-5');

    const state = useComponentPlacementStore.getState();
    expect(state.components).toHaveLength(1);
    const placed = state.components[0];
    expect(placed).toBeDefined();
    if (!placed) {
      return;
    }
    expect(placed.type).toBe('resistor');
    expect(placed.terminals[0]?.holeId).toBe('left-a-5');
  });

  it('rotates placed components in 90 degree increments', () => {
    useComponentPlacementStore.getState().setPlacingType('led');
    useComponentPlacementStore.getState().placeComponentAt('left-a-6');
    const first = useComponentPlacementStore.getState().components[0];
    expect(first).toBeDefined();
    if (!first) {
      return;
    }
    const id = first.id;

    useComponentPlacementStore.getState().rotateSelectedComponent(id);

    expect(useComponentPlacementStore.getState().components[0]?.rotation).toBe(90);
  });
});
