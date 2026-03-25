import type { ComponentType, PlacedComponent } from './componentTypes';

export interface ComponentPreviewDescriptor {
  kind: '3d' | '2d';
  assetPath?: string;
  cameraPreset?: 'isometric' | 'front' | 'top';
}

const previewRegistry: Partial<Record<ComponentType, ComponentPreviewDescriptor>> = {
  resistor: { kind: '3d', assetPath: '/assets/previews/resistor.glb', cameraPreset: 'isometric' },
  capacitor: { kind: '3d', assetPath: '/assets/previews/capacitor.glb', cameraPreset: 'isometric' },
  led: { kind: '3d', assetPath: '/assets/previews/led.glb', cameraPreset: 'isometric' },
  'npn-transistor': { kind: '3d', assetPath: '/assets/previews/npn-transistor.glb', cameraPreset: 'front' },
  'spst-switch': { kind: '2d' },
  'dc-power-supply': { kind: '2d' },
  ground: { kind: '2d' },
  'jumper-wire': { kind: '2d' },
};

export const resolveComponentPreview = (component: PlacedComponent): ComponentPreviewDescriptor => {
  return previewRegistry[component.type] ?? { kind: '2d' };
};
