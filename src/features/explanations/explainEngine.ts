import type { PlacedComponent } from '@/features/components/componentTypes';
import type { SimulationSnapshot } from '@/features/simulation/simulationTypes';

interface ExplainInput {
  selectedComponent: PlacedComponent | null;
  selectedHoleId: string | null;
  snapshot: SimulationSnapshot;
}

export interface ExplainResult {
  title: string;
  whatIsThis: string;
  whatDoingHere: string;
  currentCondition: string;
  whyItMatters: string;
}

const explainComponent = (component: PlacedComponent, snapshot: SimulationSnapshot): ExplainResult => {
  switch (component.type) {
    case 'resistor':
      return {
        title: `${component.name} · Resistor`,
        whatIsThis: `A ${component.props.resistanceOhms}Ω passive component that resists current flow.`,
        whatDoingHere: 'It limits current through the branch and sets voltage drops in series paths.',
        currentCondition: `Simulation time ${snapshot.timestampMs} ms. Terminals: ${component.terminals.map((t) => t.holeId).join(' → ')}.`,
        whyItMatters: 'Without it, an LED branch can overcurrent and fail in real hardware.',
      };
    case 'led':
      return {
        title: `${component.name} · LED`,
        whatIsThis: `A light-emitting diode (${component.props.color}) with ~${component.props.forwardVoltage}V forward drop.`,
        whatDoingHere: 'It visualizes whether a valid forward path exists in your loop.',
        currentCondition: 'LED state is derived from solved path continuity and polarity during simulation.',
        whyItMatters: 'It turns abstract node voltage into immediate visual feedback for learning.',
      };
    case 'capacitor':
      return {
        title: `${component.name} · Capacitor`,
        whatIsThis: `A ${component.props.capacitanceUf}µF energy-storage element.`,
        whatDoingHere: 'It smooths changes and creates timing behavior with surrounding resistance.',
        currentCondition: 'Charge trend depends on voltage differential across terminals over simulation steps.',
        whyItMatters: 'Capacitors teach transient behavior beyond static DC logic.',
      };
    case 'npn-transistor':
      return {
        title: `${component.name} · NPN transistor`,
        whatIsThis: `A current-controlled semiconductor switch with beta ${component.props.beta}.`,
        whatDoingHere: 'It allows a small base signal to gate larger collector-emitter current.',
        currentCondition: 'On/off behavior depends on base-emitter bias and load path continuity.',
        whyItMatters: 'Transistors are the foundation for switching, amplification, and digital logic.',
      };
    default:
      return {
        title: `${component.name}`,
        whatIsThis: `Component type: ${component.type}.`,
        whatDoingHere: 'It participates in the active circuit topology on the breadboard.',
        currentCondition: `Connected at ${component.terminals.map((terminal) => terminal.holeId).join(', ')}.`,
        whyItMatters: 'Every element contributes to path validity and measured behavior.',
      };
  }
};

export const explainSelection = ({ selectedComponent, selectedHoleId, snapshot }: ExplainInput): ExplainResult => {
  if (selectedComponent) {
    return explainComponent(selectedComponent, snapshot);
  }

  if (selectedHoleId) {
    const voltage = snapshot.nodeVoltages[selectedHoleId];
    return {
      title: `Node ${selectedHoleId}`,
      whatIsThis: 'A breadboard electrical node that can be shared by several terminals.',
      whatDoingHere: 'It links nearby component pins into a net for current flow.',
      currentCondition: `Measured voltage: ${voltage !== undefined ? `${voltage.toFixed(2)} V` : 'not yet solved'}.`,
      whyItMatters: 'Node voltage is the fastest way to verify expected circuit operation.',
    };
  }

  return {
    title: 'Select a component or node',
    whatIsThis: 'Choose something on the board to get a deterministic explanation.',
    whatDoingHere: 'This panel uses simulation and topology state, not AI generation.',
    currentCondition: 'No active selection.',
    whyItMatters: 'Deterministic explanations build trust while learning electronics.',
  };
};
