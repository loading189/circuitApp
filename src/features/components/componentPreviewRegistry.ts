import { componentRegistry } from './componentRegistry';
import type { ComponentType, PlacedComponent } from './componentTypes';

export interface ComponentPreviewDescriptor {
  kind: '3d' | '2d';
  assetPath?: string;
  cameraPreset?: 'isometric' | 'front' | 'top';
}

export interface ResolvedComponentPreview extends ComponentPreviewDescriptor {
  status: 'mapped' | 'missing' | 'invalid' | 'unsupported';
  reason?: string;
}

const FAMILY_3D_ASSETS: Partial<Record<string, string>> = {
  'axial-resistor': '/assets/previews/resistor.glb',
  'led-5mm': '/assets/previews/led.glb',
  'axial-diode': '/assets/previews/diode.glb',
  'electrolytic-capacitor': '/assets/previews/capacitor.glb',
  'ceramic-capacitor': '/assets/previews/ceramic-capacitor.glb',
  'to92-transistor': '/assets/previews/npn-transistor.glb',
  'to220-transistor': '/assets/previews/to220.glb',
  'to220-regulator': '/assets/previews/to220-regulator.glb',
  'dip-8': '/assets/previews/dip-8.glb',
  'dip-14': '/assets/previews/dip-14.glb',
  'dip-16': '/assets/previews/dip-16.glb',
  pushbutton: '/assets/previews/pushbutton.glb',
  potentiometer: '/assets/previews/potentiometer.glb',
  relay: '/assets/previews/relay.glb',
};

const resolve3dAsset = (type: ComponentType): string | undefined => {
  const definition = componentRegistry.getByType(type);
  return definition.preview.asset3d ?? FAMILY_3D_ASSETS[definition.preview.family];
};

export const resolveComponentPreview = (component: PlacedComponent | null | undefined): ResolvedComponentPreview => {
  if (!component) {
    return { kind: '2d', status: 'missing', reason: 'No selected component was provided.' };
  }

  const definition = componentRegistry.getByType(component.type);

  if (definition.preview.preferredKind === '2d') {
    return { kind: '2d', status: 'mapped' };
  }

  const assetPath = resolve3dAsset(component.type)?.trim();

  if (assetPath === undefined) {
    return { kind: '2d', status: 'unsupported', reason: `3D preview family not available for "${component.type}".` };
  }

  if (!assetPath) {
    return { kind: '2d', status: 'invalid', reason: `Invalid or missing 3D asset path for "${component.type}".` };
  }

  return { kind: '3d', status: 'mapped', assetPath, cameraPreset: 'isometric' };
};
