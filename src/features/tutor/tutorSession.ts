import type { TutorMessage } from './tutorTypes';

export const newMessage = (role: TutorMessage['role'], text: string, meta?: string): TutorMessage => ({
  id: crypto.randomUUID(),
  role,
  text,
  timestamp: new Date().toISOString(),
  meta,
});
