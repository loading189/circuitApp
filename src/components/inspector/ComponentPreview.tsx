import React from 'react';
import { resolveComponentPreview } from '@/features/components/componentPreviewRegistry';
import type { PlacedComponent } from '@/features/components/componentTypes';

interface ComponentPreviewProps {
  component: PlacedComponent;
}

const Component2DFallbackPreview = ({ component }: ComponentPreviewProps): JSX.Element => {
  return (
    <div className="flex h-36 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/70">
      <div className="text-center">
        <div className="text-3xl text-cyan-300">{component.name}</div>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">2D Preview</p>
      </div>
    </div>
  );
};

export const ComponentPreview = ({ component }: ComponentPreviewProps): JSX.Element => {
  const preview = resolveComponentPreview(component);

  if (preview.kind !== '3d' || !preview.assetPath) {
    return <Component2DFallbackPreview component={component} />;
  }

  return (
    <div className="h-36 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/70">
      {React.createElement('model-viewer', {
        src: preview.assetPath,
        'camera-controls': true,
        'auto-rotate': true,
        'shadow-intensity': '0.85',
        exposure: '1',
        style: 'width:100%;height:100%;background:radial-gradient(circle at 50% 20%, rgba(56,189,248,0.2), rgba(2,6,23,0.9));',
      } as Record<string, unknown>)}
    </div>
  );
};
