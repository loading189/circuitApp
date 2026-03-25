import type { PropsWithChildren } from 'react';

interface ToolPanelFrameProps extends PropsWithChildren {
  title: string;
  minimized: boolean;
  pinned: boolean;
  onToggleMinimize: () => void;
  onTogglePin: () => void;
}

export const ToolPanelFrame = ({ title, minimized, pinned, onToggleMinimize, onTogglePin, children }: ToolPanelFrameProps): JSX.Element => (
  <section className="rail-panel">
    <div className="mb-2 flex items-center justify-between gap-2">
      <h3 className="panel-title mb-0">{title}</h3>
      <div className="flex items-center gap-1">
        <button type="button" className={`chip-btn ${pinned ? 'chip-btn-active' : ''}`} onClick={onTogglePin}>{pinned ? 'Pinned' : 'Pin'}</button>
        <button type="button" className="chip-btn" onClick={onToggleMinimize}>{minimized ? 'Expand' : 'Minimize'}</button>
      </div>
    </div>
    {!minimized ? children : <p className="text-xs text-token-secondary">Panel minimized.</p>}
  </section>
);
