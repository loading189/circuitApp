import { create } from 'zustand';
import { buildTutorContextPayload } from './tutorContextAdapter';
import { newMessage } from './tutorSession';
import { sendTutorRequest } from './tutorTransport';
import type { TutorMessage } from './tutorTypes';

interface TutorState {
  messages: TutorMessage[];
  isLoading: boolean;
  includeDiagnostics: boolean;
  useSelectionContext: boolean;
  sendMessage: (input: string) => Promise<void>;
  toggleDiagnostics: () => void;
  toggleSelectionContext: () => void;
}

export const useTutorStore = create<TutorState>((set, get) => ({
  messages: [],
  isLoading: false,
  includeDiagnostics: true,
  useSelectionContext: true,
  sendMessage: async (input) => {
    const user = newMessage('user', input);
    set((state) => ({ messages: [...state.messages, user], isLoading: true }));

    const context = buildTutorContextPayload(input, [...get().messages, user]);
    if (!get().includeDiagnostics) {
      context.diagnostics = [];
    }
    if (!get().useSelectionContext) {
      context.selectedEntity = {};
    }

    const response = await sendTutorRequest(context);
    set((state) => ({
      messages: [...state.messages, newMessage('assistant', response.reply, response.requestId ? `req ${response.requestId}` : undefined)],
      isLoading: false,
    }));
  },
  toggleDiagnostics: () => set((state) => ({ includeDiagnostics: !state.includeDiagnostics })),
  toggleSelectionContext: () => set((state) => ({ useSelectionContext: !state.useSelectionContext })),
}));
