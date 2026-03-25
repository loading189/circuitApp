import { componentRegistry } from './componentRegistry';
import type { PlacedComponent } from './componentTypes';

export const componentColor = (component: PlacedComponent): string => {
  return componentRegistry.getByType(component.type).visual2D.accentColor;
};
