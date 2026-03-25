import { invoke } from '@tauri-apps/api/core';
import type { TutorContextPayload, TutorResponse } from './tutorTypes';

interface TauriTutorResponse {
  reply: string;
  request_id?: string;
}

export const sendTutorRequest = async (payload: TutorContextPayload): Promise<TutorResponse> => {
  try {
    const response = await invoke<TauriTutorResponse>('ask_tutor', { payload });
    return { reply: response.reply, requestId: response.request_id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tutor bridge unavailable.';
    return {
      reply:
        `I couldn't reach the local tutor bridge (${message}). You can still use Explain + Diagnostics while bridge configuration is completed.`,
    };
  }
};
