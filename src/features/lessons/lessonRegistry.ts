import { closedLoopLesson } from './content/foundations/closedLoopLesson';
import { diodeDirectionLesson } from './content/foundations/diodeDirectionLesson';
import { ledCurrentLimitingLesson } from './content/foundations/ledCurrentLimitingLesson';
import { rcChargeLesson } from './content/foundations/rcChargeLesson';
import { transistorSwitchLesson } from './content/foundations/transistorSwitchLesson';
import { voltageDividerLesson } from './content/foundations/voltageDividerLesson';
import type { LessonDefinition, LessonTrack } from './lessonTypes';

const lessons = [
  closedLoopLesson,
  ledCurrentLimitingLesson,
  voltageDividerLesson,
  rcChargeLesson,
  diodeDirectionLesson,
  transistorSwitchLesson,
] satisfies LessonDefinition[];

const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const lessonsByTrack = lessons.reduce<Record<LessonTrack, LessonDefinition[]>>((accumulator, lesson) => {
  accumulator[lesson.track].push(lesson);
  return accumulator;
}, {
  foundations: [],
  'current-and-resistance': [],
  'voltage-and-division': [],
  'time-and-capacitance': [],
  'diodes-and-polarity': [],
  'transistors-and-switching': [],
  'analog-building-blocks': [],
  'digital-logic': [],
  'measurement-and-debugging': [],
  'power-and-regulation': [],
});

export const LESSON_TRACK_LABELS: Record<LessonTrack, string> = {
  foundations: 'Foundations',
  'current-and-resistance': 'Current & resistance',
  'voltage-and-division': 'Voltage & division',
  'time-and-capacitance': 'Time & capacitance',
  'diodes-and-polarity': 'Diodes & polarity',
  'transistors-and-switching': 'Transistors & switching',
  'analog-building-blocks': 'Analog building blocks',
  'digital-logic': 'Digital logic',
  'measurement-and-debugging': 'Measurement & debugging',
  'power-and-regulation': 'Power & regulation',
};

export const lessonRegistry = {
  all: lessons,
  byTrack: lessonsByTrack,
  getById: (id: string): LessonDefinition | null => lessonMap.get(id) ?? null,
  getBySlug: (slug: string): LessonDefinition | null => lessons.find((lesson) => lesson.slug === slug) ?? null,
};

export const DEFAULT_LESSON_ID = lessons[0]?.id ?? 'lesson-closed-loop';
