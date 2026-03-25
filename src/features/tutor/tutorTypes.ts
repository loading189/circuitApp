import type { LabMode } from '@/features/ui/labUiStore';

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  meta?: string;
}

export interface TutorContextPayload {
  mode: LabMode;
  activeLesson: string;
  lessonObjectives: string[];
  currentStep: string;
  componentInventory: Array<{ id: string; type: string; terminals: string[] }>;
  selectedEntity: { componentId?: string; nodeId?: string };
  wireSummary: string;
  simulationState: string;
  nodeVoltages: Record<string, number>;
  componentStateSummaries: string[];
  diagnostics: string[];
  recentUserChanges: string[];
  recentProbeActions: string[];
  userMessage: string;
  conversation: TutorMessage[];
}

export interface TutorResponse {
  reply: string;
  requestId?: string;
}
