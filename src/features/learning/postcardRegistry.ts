import type { CircuitPostcardData } from './postcardTypes';

export const DEFAULT_POSTCARD: CircuitPostcardData = {
  id: 'guided-led-limiter',
  title: 'LED with Current-Limiting Resistor',
  conceptTitle: 'Closed Loop + Polarity + Current Limiting',
  shortSummary: 'Build a safe LED loop where resistor value determines brightness and protects the diode.',
  buildSummary: 'Place supply → resistor → LED → ground on a complete return path.',
  observePoints: [
    'LED only lights with valid forward current path.',
    'Higher resistance lowers LED current and brightness.',
    'Open switch breaks loop and extinguishes LED.',
  ],
  commonMistakes: ['Reversed LED polarity.', 'Missing resistor.', 'Open return path to ground rail.'],
  difficulty: 'Beginner',
  progressState: 'in-progress',
  previewKind: 'target-layout',
  previewData: 'Target: + rail → 330Ω resistor → LED anode, LED cathode → GND rail.',
  quickActions: ['Show target', 'Ask tutor about this circuit', 'Highlight key node', 'Show common mistake', 'Reset lab step'],
};
