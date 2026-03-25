import type { ComponentType, PlacedComponent } from './componentTypes';

export interface ComponentPreviewDescriptor {
  kind: '3d' | '2d';
  assetPath?: string;
  cameraPreset?: 'isometric' | 'front' | 'top';
}

export interface ResolvedComponentPreview extends ComponentPreviewDescriptor {
  status: 'mapped' | 'missing' | 'invalid';
  reason?: string;
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

export const resolveComponentPreview = (component: PlacedComponent | null | undefined): ResolvedComponentPreview => {
  if (!component) {
    return { kind: '2d', status: 'missing', reason: 'No selected component was provided.' };
  }

  const mappedPreview = previewRegistry[component.type];

  if (!mappedPreview) {
    return { kind: '2d', status: 'missing', reason: `No preview mapping registered for component type "${component.type}".` };
  }

  if (mappedPreview.kind === '3d') {
    const normalizedPath = typeof mappedPreview.assetPath === 'string' ? mappedPreview.assetPath.trim() : '';
    if (!normalizedPath) {
      return { kind: '2d', status: 'invalid', reason: `Invalid or missing 3D asset path for "${component.type}".` };
    }
    return { ...mappedPreview, assetPath: normalizedPath, status: 'mapped' };
  }

  return { ...mappedPreview, status: 'mapped' };
};
