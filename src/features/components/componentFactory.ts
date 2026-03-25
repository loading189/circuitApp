import type { ComponentType, PlacedComponent } from './componentTypes';

const uid = () => crypto.randomUUID();

export const createComponent = (type: ComponentType, holeA: string, holeB?: string): PlacedComponent => {
  const secondHole = holeB ?? holeA;

  switch (type) {
    case 'dc-power-supply':
      return {
        id: uid(),
        type,
        name: 'VCC',
        rotation: 0,
        terminals: [
          { id: 'positive', label: '+', holeId: holeA },
          { id: 'negative', label: '-', holeId: secondHole },
        ],
        props: { voltage: 5, isOn: true },
      };
    case 'ground':
      return {
        id: uid(),
        type,
        name: 'GND',
        rotation: 0,
        terminals: [{ id: 'gnd', label: '⏚', holeId: holeA }],
        props: { symbol: 'earth' },
      };
    case 'resistor':
      return {
        id: uid(),
        type,
        name: 'R',
        rotation: 0,
        terminals: [
          { id: 'terminalA', label: 'A', holeId: holeA },
          { id: 'terminalB', label: 'B', holeId: secondHole },
        ],
        props: { resistanceOhms: 1000 },
      };
    case 'led':
      return {
        id: uid(),
        type,
        name: 'LED',
        rotation: 0,
        terminals: [
          { id: 'anode', label: 'A', holeId: holeA },
          { id: 'cathode', label: 'K', holeId: secondHole },
        ],
        props: { color: 'red', forwardVoltage: 2 },
      };
    case 'spst-switch':
      return {
        id: uid(),
        type,
        name: 'SW',
        rotation: 0,
        terminals: [
          { id: 'terminalA', label: 'A', holeId: holeA },
          { id: 'terminalB', label: 'B', holeId: secondHole },
        ],
        props: { isClosed: false },
      };
    case 'capacitor':
      return {
        id: uid(),
        type,
        name: 'C',
        rotation: 0,
        terminals: [
          { id: 'positive', label: '+', holeId: holeA },
          { id: 'negative', label: '-', holeId: secondHole },
        ],
        props: { capacitanceUf: 10 },
      };
    case 'npn-transistor':
      return {
        id: uid(),
        type,
        name: 'Q',
        rotation: 0,
        terminals: [
          { id: 'base', label: 'B', holeId: holeA },
          { id: 'collector', label: 'C', holeId: secondHole },
          { id: 'emitter', label: 'E', holeId: holeA },
        ],
        props: { beta: 100 },
      };
    case 'jumper-wire':
      return {
        id: uid(),
        type,
        name: 'JMP',
        rotation: 0,
        terminals: [
          { id: 'terminalA', label: 'A', holeId: holeA },
          { id: 'terminalB', label: 'B', holeId: secondHole },
        ],
        props: { color: 'cyan' },
      };
    default:
      throw new Error(`Unsupported component type: ${String(type)}`);
  }
};
