import { closedLoopLesson } from './content/foundations/closedLoopLesson';
import { diodeDirectionLesson } from './content/foundations/diodeDirectionLesson';
import { ledCurrentLimitingLesson } from './content/foundations/ledCurrentLimitingLesson';
import { rcChargeLesson } from './content/foundations/rcChargeLesson';
import { transistorSwitchLesson } from './content/foundations/transistorSwitchLesson';
import { voltageDividerLesson } from './content/foundations/voltageDividerLesson';
import type { LessonDefinition } from './lessonTypes';

const lessons = [
  closedLoopLesson,
  ledCurrentLimitingLesson,
  voltageDividerLesson,
  rcChargeLesson,
  diodeDirectionLesson,
  transistorSwitchLesson,
] satisfies LessonDefinition[];

const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export const lessonRegistry = {
  all: lessons,
  getById: (id: string): LessonDefinition | null => lessonMap.get(id) ?? null,
  getBySlug: (slug: string): LessonDefinition | null => lessons.find((lesson) => lesson.slug === slug) ?? null,
};

export const DEFAULT_LESSON_ID = lessons[0]?.id ?? 'lesson-closed-loop';
