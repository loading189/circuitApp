import { useState } from 'react';
import { CircuitPostcardCompact } from './CircuitPostcardCompact';
import { CircuitPostcardExpanded } from './CircuitPostcardExpanded';
import { DEFAULT_POSTCARD } from '@/features/learning/postcardRegistry';

export const CircuitPostcard = (): JSX.Element => {
  const [expanded, setExpanded] = useState(true);
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button type="button" className="postcard-floating w-56 text-left" onClick={() => setMinimized(false)}>
        Open lesson postcard
      </button>
    );
  }

  return (
    <article className="postcard-floating w-[360px]">
      <div className="flex items-center justify-between gap-2">
        <CircuitPostcardCompact card={DEFAULT_POSTCARD} />
        <div className="flex gap-2">
          <button type="button" className="chip-btn" onClick={() => setExpanded((prev) => !prev)}>{expanded ? 'Collapse' : 'Expand'}</button>
          <button type="button" className="chip-btn" onClick={() => setMinimized(true)}>Minimize</button>
        </div>
      </div>
      {expanded ? <CircuitPostcardExpanded card={DEFAULT_POSTCARD} /> : null}
    </article>
  );
};
