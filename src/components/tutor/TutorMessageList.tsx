import type { TutorMessage } from '@/features/tutor/tutorTypes';

export const TutorMessageList = ({ messages }: { messages: TutorMessage[] }): React.JSX.Element => {
  if (!messages.length) {
    return <p className="rounded-lg border border-dashed border-token-soft p-3 text-xs text-token-secondary">No messages yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {messages.map((message) => (
        <li key={message.id} className={`rounded-lg border p-2 text-xs ${message.role === 'assistant' ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-token-soft bg-token-elevated'}`}>
          <p className="text-[10px] uppercase tracking-wider text-token-secondary">{message.role}</p>
          <p className="mt-1 text-token-primary">{message.text}</p>
          {message.meta ? <p className="mt-1 text-[10px] text-cyan-300">{message.meta}</p> : null}
        </li>
      ))}
    </ul>
  );
};
