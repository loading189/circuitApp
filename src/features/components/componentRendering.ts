import type { PlacedComponent } from './componentTypes';

export const componentColor = (component: PlacedComponent): string => {
  switch (component.type) {
    case 'dc-power-supply':
      return '#22d3ee';
    case 'ground':
      return '#94a3b8';
    case 'resistor':
      return '#f59e0b';
    case 'led':
      return '#ef4444';
    case 'spst-switch':
      return '#f97316';
    case 'capacitor':
      return '#10b981';
    case 'npn-transistor':
      return '#a78bfa';
    default:
      return '#e2e8f0';
  }
};
