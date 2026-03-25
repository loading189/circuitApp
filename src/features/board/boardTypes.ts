export type RailPolarity = 'positive' | 'negative';

export type BreadboardHoleZone =
  | 'rail-top-positive'
  | 'rail-top-negative'
  | 'rail-bottom-positive'
  | 'rail-bottom-negative'
  | 'left-strip'
  | 'right-strip';

export type StripColumn = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j';

export interface BreadboardHole {
  id: string;
  zone: BreadboardHoleZone;
  row: number;
  column: StripColumn | null;
  x: number;
  y: number;
  defaultNetGroup: string;
}

export interface BreadboardGeometry {
  width: number;
  height: number;
  holeRadius: number;
  holes: BreadboardHole[];
  holesById: Record<string, BreadboardHole>;
  stripsByDefaultNet: Record<string, string[]>;
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}
