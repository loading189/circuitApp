import { useState } from 'react';

export const TutorComposer = ({ onSend }: { onSend: (text: string) => Promise<void> }): JSX.Element => {
  const [value, setValue] = useState('');

  return (
    <form
      className="mt-3"
      onSubmit={(event) => {
        event.preventDefault();
        const input = value.trim();
        if (!input) {
          return;
        }
        void onSend(input);
        setValue('');
      }}
    >
      <textarea
        rows={3}
        className="w-full rounded-lg border border-token-soft bg-token-elevated px-2 py-2 text-xs text-token-primary outline-none transition focus:border-cyan-400"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask the tutor about this circuit…"
      />
      <button type="submit" className="control-btn mt-2 w-full justify-center">
        Send to Tutor
      </button>
    </form>
  );
};
