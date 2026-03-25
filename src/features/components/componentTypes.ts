export type ComponentType =
  | 'dc-power-supply'
  | 'ground'
  | 'resistor'
  | 'led'
  | 'spst-switch'
  | 'capacitor'
  | 'npn-transistor'
  | 'jumper-wire';

export interface ComponentTerminal {
  id: string;
  label: string;
  holeId: string;
}

export interface BasePlacedComponent<TType extends ComponentType, TProps> {
  id: string;
  type: TType;
  name: string;
  rotation: 0 | 90 | 180 | 270;
  terminals: ComponentTerminal[];
  props: TProps;
}

export interface DCPowerSupplyProps {
  voltage: number;
  isOn: boolean;
}

export interface GroundProps {
  symbol: 'earth';
}

export interface ResistorProps {
  resistanceOhms: number;
}

export interface LedProps {
  color: 'red' | 'green' | 'yellow' | 'blue';
  forwardVoltage: number;
}

export interface SwitchProps {
  isClosed: boolean;
}

export interface CapacitorProps {
  capacitanceUf: number;
}

export interface NpnProps {
  beta: number;
}

export interface JumperWireProps {
  color: 'cyan' | 'violet' | 'amber';
}

export type PlacedComponent =
  | BasePlacedComponent<'dc-power-supply', DCPowerSupplyProps>
  | BasePlacedComponent<'ground', GroundProps>
  | BasePlacedComponent<'resistor', ResistorProps>
  | BasePlacedComponent<'led', LedProps>
  | BasePlacedComponent<'spst-switch', SwitchProps>
  | BasePlacedComponent<'capacitor', CapacitorProps>
  | BasePlacedComponent<'npn-transistor', NpnProps>
  | BasePlacedComponent<'jumper-wire', JumperWireProps>;

export type ComponentCategory = 'Power' | 'Passive' | 'Semiconductors' | 'Switches' | 'Instruments';

export interface ComponentPaletteItem {
  type: ComponentType;
  title: string;
  description: string;
  category: ComponentCategory;
  icon: string;
}

export const COMPONENT_PALETTE: ComponentPaletteItem[] = [
  { type: 'dc-power-supply', title: 'DC Supply', description: 'Inject stable bench voltage.', category: 'Power', icon: '⎓' },
  { type: 'ground', title: 'Ground', description: 'Reference return node.', category: 'Power', icon: '⏚' },
  { type: 'resistor', title: 'Resistor', description: 'Current limiting / divider.', category: 'Passive', icon: 'Ω' },
  { type: 'capacitor', title: 'Capacitor', description: 'Stores charge over time.', category: 'Passive', icon: '∥' },
  { type: 'led', title: 'LED', description: 'Visual diode indicator.', category: 'Semiconductors', icon: '◉' },
  { type: 'npn-transistor', title: 'NPN', description: 'Educational transistor switch.', category: 'Semiconductors', icon: '⇵' },
  { type: 'spst-switch', title: 'SPST Switch', description: 'Simple open/closed control.', category: 'Switches', icon: '⏻' },
  { type: 'jumper-wire', title: 'Jumper Wire', description: 'Direct low-ohm connection.', category: 'Instruments', icon: '∿' },
];
