import { LESSON_SUPPORT_PROFILES } from './lessonSupportProfiles';
import type { LessonSupportLevel } from './lessonTypes';

export const buildTutorSupportInstruction = (supportLevel: LessonSupportLevel): string => {
  const style = LESSON_SUPPORT_PROFILES[supportLevel].tutorStyle;

  if (style === 'directive') {
    return 'Support level: Guided. Be directive and step-oriented. Provide concrete next actions and reference highlighted targets when available.';
  }

  if (style === 'coach') {
    return 'Support level: Coached. Be a coach. Prompt the learner with partial hints and topology reasoning before revealing precise answers.';
  }

  if (style === 'socratic') {
    return 'Support level: Independent. Use Socratic questioning. Focus on observations, diagnostics, and reasoning over direct answers.';
  }

  return 'Support level: Sandbox. Keep help available but non-intrusive and exploratory.';
};
