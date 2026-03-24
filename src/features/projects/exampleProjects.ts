import type { ProjectFile } from './projectTypes';

export interface ExampleProject {
  id: string;
  title: string;
  summary: string;
  expectedBehavior: string;
  project: ProjectFile;
}

const emptyProject = (name: string): ProjectFile => ({
  name,
  version: 1,
  components: [],
  wires: [],
  viewport: { zoom: 1, panX: 0, panY: 0 },
});

export const EXAMPLE_PROJECTS: ExampleProject[] = [
  {
    id: 'led-resistor',
    title: 'LED with Resistor',
    summary: 'A baseline current-limited LED loop.',
    expectedBehavior: 'LED should illuminate when loop closes through ground.',
    project: emptyProject('LED with Resistor'),
  },
  {
    id: 'switch-led',
    title: 'Switch-Controlled LED',
    summary: 'Adds an SPST gate to LED path.',
    expectedBehavior: 'LED toggles with switch state.',
    project: emptyProject('Switch-Controlled LED'),
  },
  {
    id: 'voltage-divider',
    title: 'Voltage Divider',
    summary: 'Two resistors split supply potential.',
    expectedBehavior: 'Midpoint node reads predictable fraction of supply.',
    project: emptyProject('Voltage Divider'),
  },
  {
    id: 'rc-charge-discharge',
    title: 'RC Charge / Discharge',
    summary: 'Capacitor response over time under switched path.',
    expectedBehavior: 'Node trace ramps toward source then decays.',
    project: emptyProject('RC Charge / Discharge'),
  },
  {
    id: 'npn-switch',
    title: 'NPN Transistor Switch',
    summary: 'Base drive controls collector-emitter path.',
    expectedBehavior: 'Load on collector activates when base is driven.',
    project: emptyProject('NPN Transistor Switch'),
  },
];
