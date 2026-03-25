export type ComponentType =
  | 'dc-power-supply'
  | 'ground'
  | 'resistor'
  | 'led'
  | 'spst-switch'
  | 'capacitor'
  | 'npn-transistor';

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

export type PlacedComponent =
  | BasePlacedComponent<'dc-power-supply', DCPowerSupplyProps>
  | BasePlacedComponent<'ground', GroundProps>
  | BasePlacedComponent<'resistor', ResistorProps>
  | BasePlacedComponent<'led', LedProps>
  | BasePlacedComponent<'spst-switch', SwitchProps>
  | BasePlacedComponent<'capacitor', CapacitorProps>
  | BasePlacedComponent<'npn-transistor', NpnProps>;

export interface ComponentPaletteItem {
  type: ComponentType;
  title: string;
  description: string;
}

export const COMPONENT_PALETTE: ComponentPaletteItem[] = [
  { type: 'dc-power-supply', title: 'DC Supply', description: 'Inject variable bench voltage.' },
  { type: 'ground', title: 'Ground', description: 'Reference return node.' },
  { type: 'resistor', title: 'Resistor', description: 'Current limiting / divider element.' },
  { type: 'led', title: 'LED', description: 'Visual diode indicator.' },
  { type: 'spst-switch', title: 'SPST Switch', description: 'Simple open/closed control.' },
  { type: 'capacitor', title: 'Capacitor', description: 'Stores charge over time.' },
  { type: 'npn-transistor', title: 'NPN', description: 'Educational transistor switch.' },
];
