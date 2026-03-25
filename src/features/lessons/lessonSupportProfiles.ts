import type { ToolPanelId } from '@/features/ui/toolPanelStore';
import type { LessonSupportLevel } from './lessonTypes';

interface LessonSupportProfile {
  label: string;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard' | 'Free';
  description: string;
  launchHighlights: string[];
  tutorStyle: string;
  showExactPlacement: boolean;
  showExactWiring: boolean;
  showPostcardByDefault: boolean;
  emphasizedPanels: ToolPanelId[];
}

export const LESSON_SUPPORT_PROFILES: Record<LessonSupportLevel, LessonSupportProfile> = {
  sandbox: {
    label: 'Sandbox',
    difficultyLabel: 'Free',
    description: 'Open bench with no lesson scaffolding.',
    launchHighlights: ['No active overlays', 'All tools available', 'Optional lesson reference only'],
    tutorStyle: 'open_lab',
    showExactPlacement: false,
    showExactWiring: false,
    showPostcardByDefault: false,
    emphasizedPanels: ['tutor', 'instruments', 'diagnostics', 'explain'],
  },
  guided: {
    label: 'Guided',
    difficultyLabel: 'Easy',
    description: 'Premium step-by-step guidance with exact placement, exact wires, and clear success cues.',
    launchHighlights: ['Exact placement targets on board', 'Exact wire start/end prompts', 'Calm next-action coaching'],
    tutorStyle: 'directive',
    showExactPlacement: true,
    showExactWiring: true,
    showPostcardByDefault: true,
    emphasizedPanels: ['tutor', 'diagnostics', 'flow', 'explain'],
  },
  coached: {
    label: 'Coached',
    difficultyLabel: 'Medium',
    description: 'Concept coaching with lighter topology hints.',
    launchHighlights: ['Concept-first hints', 'Region/topology cues', 'Coaching prompts on demand'],
    tutorStyle: 'coach',
    showExactPlacement: false,
    showExactWiring: false,
    showPostcardByDefault: true,
    emphasizedPanels: ['tutor', 'explain', 'diagnostics', 'instruments'],
  },
  independent: {
    label: 'Independent',
    difficultyLabel: 'Hard',
    description: 'Challenge mode with minimal scaffolding and Socratic tutoring.',
    launchHighlights: ['Goal + required parts', 'Observation prompts', 'No exact placement overlays'],
    tutorStyle: 'socratic',
    showExactPlacement: false,
    showExactWiring: false,
    showPostcardByDefault: true,
    emphasizedPanels: ['tutor', 'instruments', 'diagnostics', 'flow'],
  },
};

export const LESSON_LAUNCH_LEVELS: LessonSupportLevel[] = ['guided', 'coached', 'independent'];
