import { TutorComposer } from './TutorComposer';
import { TutorMessageList } from './TutorMessageList';
import { TutorQuickPrompts } from './TutorQuickPrompts';
import { TutorStatus } from './TutorStatus';
import { useTutorStore } from '@/features/tutor/tutorStore';

export const TutorPanel = (): JSX.Element => {
  const { messages, isLoading, sendMessage, includeDiagnostics, toggleDiagnostics, useSelectionContext, toggleSelectionContext } = useTutorStore();

  return (
    <section className="rail-panel">
      <h3 className="panel-title">Tutor</h3>
      <div className="flex gap-2 text-[11px]">
        <button type="button" className={`chip-btn ${includeDiagnostics ? 'chip-btn-active' : ''}`} onClick={toggleDiagnostics}>Include diagnostics</button>
        <button type="button" className={`chip-btn ${useSelectionContext ? 'chip-btn-active' : ''}`} onClick={toggleSelectionContext}>Use selection</button>
      </div>
      <TutorQuickPrompts onPick={(prompt) => void sendMessage(prompt)} />
      <div className="mt-3 max-h-64 overflow-auto pr-1">
        <TutorMessageList messages={messages} />
      </div>
      <TutorStatus isLoading={isLoading} />
      <TutorComposer onSend={sendMessage} />
    </section>
  );
};
