import { tutorQuickPrompts } from '@/features/tutor/tutorPrompts';

export const TutorQuickPrompts = ({ onPick }: { onPick: (value: string) => void }): JSX.Element => (
  <div className="mt-2 flex flex-wrap gap-2">
    {tutorQuickPrompts.map((prompt) => (
      <button key={prompt} type="button" className="chip-btn" onClick={() => onPick(prompt)}>
        {prompt}
      </button>
    ))}
  </div>
);
