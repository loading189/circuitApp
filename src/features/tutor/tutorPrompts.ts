export const tutorSystemPrompt = `You are the Virtual Electronics Lab tutor. Be concise, practical, and educational.
Always ground answers in provided structured context. If key details are missing, say what to probe next.`;

export const tutorQuickPrompts = [
  'Explain selected part',
  "Why doesn't this work?",
  'What changed?',
  'What should I test next?',
  'Quiz me on this concept',
] as const;
