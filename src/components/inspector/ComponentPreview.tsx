import React, { useEffect, useMemo, useState } from 'react';
import { resolveComponentPreview } from '@/features/components/componentPreviewRegistry';
import type { PlacedComponent } from '@/features/components/componentTypes';

interface ComponentPreviewProps {
  component?: PlacedComponent | null;
}

const logPreviewDiagnostic = (message: string, details?: Record<string, unknown>): void => {
  try {
    console.warn('[ComponentPreview]', message, details ?? {});
  } catch {
    // no-op: diagnostics must never crash rendering
  }
};

const Component2DFallbackPreview = ({
  component,
  subtitle,
}: ComponentPreviewProps & { subtitle: string }): React.JSX.Element => {
  return (
    <div className="flex h-36 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/70">
      <div className="text-center">
        <div className="text-3xl text-cyan-300">{component?.name ?? 'No selection'}</div>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
};

class PreviewErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  public state = { hasError: false };

  public static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  public componentDidCatch(error: Error): void {
    logPreviewDiagnostic('Preview render failed and fell back to 2D.', { error: error.message });
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return <Component2DFallbackPreview subtitle="Preview unavailable (render error)" />;
    }
    return this.props.children;
  }
}

const ModelViewerPreview = ({ assetPath, component }: { assetPath: string; component: PlacedComponent }): React.JSX.Element => {
  const [assetFailed, setAssetFailed] = useState(false);
  const modelViewerAvailable = typeof window !== 'undefined' && typeof window.customElements !== 'undefined'
    ? Boolean(window.customElements.get('model-viewer'))
    : false;

  useEffect(() => {
    setAssetFailed(false);
  }, [assetPath, component.id]);

  useEffect(() => {
    if (!modelViewerAvailable) {
      logPreviewDiagnostic('model-viewer is not registered; using 2D fallback.', { componentType: component.type });
    }
  }, [component.type, modelViewerAvailable]);

  if (!modelViewerAvailable) {
    return <Component2DFallbackPreview component={component} subtitle="2D preview (3D viewer unavailable)" />;
  }

  if (assetFailed) {
    return <Component2DFallbackPreview component={component} subtitle="2D preview (invalid 3D asset)" />;
  }

  return (
    <div className="h-36 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/70">
      {React.createElement('model-viewer', {
        src: assetPath,
        alt: `${component.name} 3D preview`,
        loading: 'lazy',
        reveal: 'interaction',
        'camera-controls': true,
        'auto-rotate': true,
        'shadow-intensity': '0.85',
        exposure: '1',
        onError: () => {
          logPreviewDiagnostic('3D asset failed to load; using 2D fallback.', { assetPath, componentType: component.type });
          setAssetFailed(true);
        },
        style: 'width:100%;height:100%;background:radial-gradient(circle at 50% 20%, rgba(56,189,248,0.2), rgba(2,6,23,0.9));',
      } as Record<string, unknown>)}
    </div>
  );
};

const ComponentPreviewContent = ({ component }: ComponentPreviewProps): React.JSX.Element => {
  const preview = resolveComponentPreview(component);
  const safeAssetPath = useMemo(() => preview.assetPath?.trim() ?? '', [preview.assetPath]);

  useEffect(() => {
    if (component && preview.status !== 'mapped') {
      logPreviewDiagnostic('Preview mapping issue; using fallback.', {
        componentType: component.type,
        reason: preview.reason,
      });
    }
  }, [component, preview.reason, preview.status]);

  if (!component) {
    return <Component2DFallbackPreview subtitle="Select a component for preview" />;
  }

  if (preview.status === 'missing') {
    return <Component2DFallbackPreview component={component} subtitle="2D preview (no mapping)" />;
  }

  if (preview.status === 'unsupported') {
    return <Component2DFallbackPreview component={component} subtitle="2D preview (3D unsupported)" />;
  }

  if (preview.kind !== '3d') {
    return <Component2DFallbackPreview component={component} subtitle="2D preview" />;
  }

  if (preview.status === 'invalid' || !safeAssetPath) {
    return <Component2DFallbackPreview component={component} subtitle="2D preview (invalid asset config)" />;
  }

  return <ModelViewerPreview assetPath={safeAssetPath} component={component} />;
};

export const ComponentPreview = ({ component }: ComponentPreviewProps): React.JSX.Element => {
  return (
    <PreviewErrorBoundary>
      <ComponentPreviewContent component={component} />
    </PreviewErrorBoundary>
  );
};
