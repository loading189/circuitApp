export type PostcardProgressState = 'not-started' | 'in-progress' | 'completed';

export interface CircuitPostcardData {
  id: string;
  title: string;
  conceptTitle: string;
  shortSummary: string;
  buildSummary: string;
  observePoints: string[];
  commonMistakes: string[];
  difficulty: 'Beginner' | 'Intermediate';
  progressState: PostcardProgressState;
  previewKind: 'schematic' | 'target-layout';
  previewData: string;
  quickActions: Array<'Show target' | 'Ask tutor about this circuit' | 'Highlight key node' | 'Show common mistake' | 'Reset lab step'>;
}
