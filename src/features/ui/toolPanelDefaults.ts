import { LESSON_SUPPORT_PROFILES } from '@/features/lessons/lessonSupportProfiles';
import type { LessonSupportLevel } from '@/features/lessons/lessonTypes';
import type { ToolPanelId } from './toolPanelStore';

export const getDefaultPanelForSupportLevel = (supportLevel: LessonSupportLevel): ToolPanelId => {
  return LESSON_SUPPORT_PROFILES[supportLevel].emphasizedPanels[0] ?? 'inspector';
};
