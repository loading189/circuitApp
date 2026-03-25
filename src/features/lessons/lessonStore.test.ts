import { beforeEach, describe, expect, it } from 'vitest';
import { useFlowVisualizationStore } from '@/features/flow/flowVisualizationStore';
import { useLessonRunStore } from './lessonRunStore';
import { useLessonStore } from './lessonStore';

describe('lesson store replay behavior', () => {
  beforeEach(() => {
    useFlowVisualizationStore.getState().reset();
    useLessonRunStore.setState({ activeRun: null });
    useLessonStore.setState({
      activeLessonId: 'lesson-led-current-limiter',
      activeStepIndex: 0,
      activeSupportLevel: 'guided',
      launchLessonSelectorOpen: false,
      highlightedOnly: true,
      libraryMode: 'required',
      postcardPinned: false,
      postcardState: 'expanded',
      postcardPosition: { x: 28, y: 24 },
      resetBoardRequestedAt: null,
    });
  });

  it('resets flow and postcard state when restarting lesson', () => {
    useLessonStore.getState().activateLesson('lesson-led-current-limiter', 'guided');
    useFlowVisualizationStore.getState().setEnabled(true);
    useLessonStore.setState({ postcardPinned: true, postcardPosition: { x: 240, y: 180 } });

    useLessonStore.getState().restartLessonRun('guided');

    expect(useFlowVisualizationStore.getState().enabled).toBe(false);
    expect(useLessonStore.getState().postcardPinned).toBe(false);
    expect(useLessonStore.getState().postcardPosition).toEqual({ x: 28, y: 24 });
    expect(useLessonStore.getState().activeStepIndex).toBe(0);
  });
});
