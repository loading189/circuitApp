import type { PlacedComponent } from '../components/componentTypes';
import type { Wire } from '../wiring/wireTypes';
import type { ViewportState } from '../board/boardTypes';

export interface ProjectFile {
  name: string;
  version: 1;
  components: PlacedComponent[];
  wires: Wire[];
  viewport: ViewportState;
  notes?: string;
}
