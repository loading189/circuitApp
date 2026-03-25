import { create } from 'zustand';

export interface MicroTeachingMoment {
  id: string;
  text: string;
  stepId: string;
  lessonId: string;
  createdAt: number;
}

interface MicroTeachingState {
  activeMoment: MicroTeachingMoment | null;
  showMoment: (input: Omit<MicroTeachingMoment, 'createdAt'>) => void;
  dismissMoment: () => void;
}

export const useMicroTeachingStore = create<MicroTeachingState>((set) => ({
  activeMoment: null,
  showMoment: (input) =>
    set({
      activeMoment: {
        ...input,
        createdAt: Date.now(),
      },
    }),
  dismissMoment: () => set({ activeMoment: null }),
}));
