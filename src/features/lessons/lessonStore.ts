import { create } from 'zustand';
import { DEFAULT_LESSON_ID, lessonRegistry } from './lessonRegistry';
import { LESSON_SUPPORT_PROFILES } from './lessonSupportProfiles';
import { useLessonRunStore } from './lessonRunStore';
import { useToolPanelStore } from '@/features/ui/toolPanelStore';
import type { LessonDefinition, LessonSupportLevel } from './lessonTypes';
import type { LessonLibraryMode } from './lessonFilters';

export type LessonPostcardState = 'compact' | 'expanded' | 'minimized' | 'completed';

interface LessonState {
  activeLessonId: string | null;
  activeStepIndex: number;
  activeSupportLevel: LessonSupportLevel;
  launchLessonSelectorOpen: boolean;
  highlightedOnly: boolean;
  libraryMode: LessonLibraryMode;
  postcardPinned: boolean;
  postcardState: LessonPostcardState;
  postcardPosition: { x: number; y: number };
  activateLesson: (lessonId: string, supportLevel?: LessonSupportLevel) => void;
  openLessonLaunch: (lessonId: string) => void;
  closeLessonLaunch: () => void;
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
  restartLessonRun: (supportLevel?: LessonSupportLevel) => void;
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
  activeSupportLevel: 'guided',
  launchLessonSelectorOpen: false,
  highlightedOnly: true,
  libraryMode: 'required',
  postcardPinned: false,
  postcardState: 'expanded',
  postcardPosition: { x: 28, y: 24 },
  resetBoardRequestedAt: null,
  activateLesson: (lessonId, supportLevel = get().activeSupportLevel) => {
    const resolvedId = lessonRegistry.getById(lessonId) ? lessonId : DEFAULT_LESSON_ID;
    const supportProfile = LESSON_SUPPORT_PROFILES[supportLevel];
    useLessonRunStore.getState().launchLessonRun(resolvedId, supportLevel);
    useToolPanelStore.getState().applySupportDefaults(supportLevel);
    set({
      activeLessonId: resolvedId,
      activeStepIndex: 0,
      activeSupportLevel: supportLevel,
      postcardState: supportProfile.showPostcardByDefault ? 'expanded' : 'minimized',
      highlightedOnly: supportLevel === 'guided',
      libraryMode: supportLevel === 'guided' ? 'required' : 'lesson',
      launchLessonSelectorOpen: false,
    });
  },
  openLessonLaunch: (lessonId) => set({ launchLessonSelectorOpen: true, activeLessonId: lessonId }),
  closeLessonLaunch: () => set({ launchLessonSelectorOpen: false }),
  setLessonBySlug: (slug) => {
    const lesson = lessonRegistry.getBySlug(slug);
    if (lesson) {
      get().activateLesson(lesson.id, get().activeSupportLevel);
    }
  },
  nextStep: () => {
    const lesson = lessonRegistry.getById(get().activeLessonId ?? '');
    set((state) => {
      const nextIndex = normalizeStepIndex(lesson, state.activeStepIndex + 1);
      const complete = lesson ? nextIndex >= lesson.steps.length - 1 : false;
      useLessonRunStore.getState().setStepIndex(nextIndex);
      return {
        activeStepIndex: nextIndex,
        postcardState: complete ? 'completed' : state.postcardState === 'minimized' ? 'compact' : state.postcardState,
      };
    });
  },
  previousStep: () => {
    const lesson = lessonRegistry.getById(get().activeLessonId ?? '');
    set((state) => {
      const activeStepIndex = normalizeStepIndex(lesson, state.activeStepIndex - 1);
      useLessonRunStore.getState().setStepIndex(activeStepIndex);
      return { activeStepIndex, postcardState: 'compact' };
    });
  },
  setStepIndex: (index) => {
    const lesson = lessonRegistry.getById(get().activeLessonId ?? '');
    const activeStepIndex = normalizeStepIndex(lesson, index);
    useLessonRunStore.getState().setStepIndex(activeStepIndex);
    set({ activeStepIndex });
  },
  setLibraryMode: (libraryMode) => set({ libraryMode }),
  toggleHighlightedOnly: () => set((state) => ({ highlightedOnly: !state.highlightedOnly })),
  setPostcardPinned: (postcardPinned) => set({ postcardPinned }),
  setPostcardState: (postcardState) => set({ postcardState }),
  setPostcardPosition: (postcardPosition) => set({ postcardPosition }),
  requestLessonReset: () => set({ resetBoardRequestedAt: Date.now() }),
  restartLessonRun: (supportLevel) => {
    const level = supportLevel ?? get().activeSupportLevel;
    useLessonRunStore.getState().restartRun(level);
    useToolPanelStore.getState().applySupportDefaults(level);
    set({
      activeSupportLevel: level,
      activeStepIndex: 0,
      postcardState: LESSON_SUPPORT_PROFILES[level].showPostcardByDefault ? 'expanded' : 'minimized',
      highlightedOnly: level === 'guided',
      libraryMode: level === 'independent' ? 'lesson' : 'required',
      resetBoardRequestedAt: Date.now(),
    });
  },
}));
