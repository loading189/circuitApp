import { create } from 'zustand';
import { DEFAULT_LESSON_ID, lessonRegistry } from './lessonRegistry';
import type { LessonDefinition } from './lessonTypes';
import type { LessonLibraryMode } from './lessonFilters';

export type LessonPostcardState = 'compact' | 'expanded' | 'minimized' | 'completed';

interface LessonState {
  activeLessonId: string | null;
  activeStepIndex: number;
  highlightedOnly: boolean;
  libraryMode: LessonLibraryMode;
  postcardPinned: boolean;
  postcardState: LessonPostcardState;
  postcardPosition: { x: number; y: number };
  activateLesson: (lessonId: string) => void;
  setLessonBySlug: (slug: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStepIndex: (index: number) => void;
  setLibraryMode: (mode: LessonLibraryMode) => void;
  toggleHighlightedOnly: () => void;
  setPostcardPinned: (value: boolean) => void;
  setPostcardState: (value: LessonPostcardState) => void;
  setPostcardPosition: (position: { x: number; y: number }) => void;
  resetBoardRequestedAt: number | null;
  requestLessonReset: () => void;
}

const normalizeStepIndex = (lesson: LessonDefinition | null, index: number): number => {
  if (!lesson) {
    return 0;
  }
  return Math.max(0, Math.min(index, lesson.steps.length - 1));
};

export const useLessonStore = create<LessonState>((set, get) => ({
  activeLessonId: DEFAULT_LESSON_ID,
  activeStepIndex: 0,
  highlightedOnly: false,
  libraryMode: 'full',
  postcardPinned: false,
  postcardState: 'expanded',
  postcardPosition: { x: 28, y: 24 },
  resetBoardRequestedAt: null,
  activateLesson: (lessonId) =>
    set({
      activeLessonId: lessonRegistry.getById(lessonId) ? lessonId : DEFAULT_LESSON_ID,
      activeStepIndex: 0,
      postcardState: 'expanded',
      highlightedOnly: false,
      libraryMode: 'full',
    }),
  setLessonBySlug: (slug) => {
    const lesson = lessonRegistry.getBySlug(slug);
    if (lesson) {
      set({ activeLessonId: lesson.id, activeStepIndex: 0 });
    }
  },
  nextStep: () => {
    const lesson = lessonRegistry.getById(get().activeLessonId ?? '');
    set((state) => {
      const nextIndex = normalizeStepIndex(lesson, state.activeStepIndex + 1);
      const complete = lesson ? nextIndex >= lesson.steps.length - 1 : false;
      return {
        activeStepIndex: nextIndex,
        postcardState: complete ? 'completed' : state.postcardState === 'minimized' ? 'compact' : state.postcardState,
      };
    });
  },
  previousStep: () => {
    const lesson = lessonRegistry.getById(get().activeLessonId ?? '');
    set((state) => ({ activeStepIndex: normalizeStepIndex(lesson, state.activeStepIndex - 1), postcardState: 'compact' }));
  },
  setStepIndex: (index) => {
    const lesson = lessonRegistry.getById(get().activeLessonId ?? '');
    set({ activeStepIndex: normalizeStepIndex(lesson, index) });
  },
  setLibraryMode: (libraryMode) => set({ libraryMode }),
  toggleHighlightedOnly: () => set((state) => ({ highlightedOnly: !state.highlightedOnly })),
  setPostcardPinned: (postcardPinned) => set({ postcardPinned }),
  setPostcardState: (postcardState) => set({ postcardState }),
  setPostcardPosition: (postcardPosition) => set({ postcardPosition }),
  requestLessonReset: () => set({ resetBoardRequestedAt: Date.now() }),
}));
