export type WireColor = 'red' | 'black' | 'yellow' | 'blue' | 'green' | 'orange' | 'white';

export type WireStyle = 'jumper-curved';

export interface Wire {
  id: string;
  startHoleId: string;
  endHoleId: string;
  color: WireColor;
  style: WireStyle;
  routing?: {
    controlOffset?: number;
  };
}

export const WIRE_COLOR_HEX: Record<WireColor, string> = {
  red: '#ef4444',
  black: '#0f172a',
  yellow: '#facc15',
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#fb923c',
  white: '#f8fafc',
};

export const DEFAULT_WIRE_COLOR: WireColor = 'red';
