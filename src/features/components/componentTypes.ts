export const COMPONENT_CATEGORIES = [
  'Power',
  'Passive',
  'Diodes & Light',
  'Transistors',
  'Integrated Circuits',
  'Switches & Controls',
  'Sensors',
  'Output Devices',
  'Timing & Analog',
  'Digital Logic',
  'Utility / Protection',
  'Breadboard Helpers',
] as const;

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];
export type SimulationSupportTier = 'full' | 'partial' | 'reference';

export const SIMULATION_SUPPORT_TIERS: SimulationSupportTier[] = ['full', 'partial', 'reference'];

export type ComponentType =
  | 'dc-power-supply'
  | 'bench-power-supply'
  | 'battery-source'
  | 'ground'
  | 'voltage-regulator'
  | 'clock-source'
  | 'resistor'
  | 'ceramic-capacitor'
  | 'electrolytic-capacitor'
  | 'potentiometer'
  | 'trim-potentiometer'
  | 'photoresistor'
  | 'thermistor'
  | 'capacitor'
  | 'led'
  | 'ir-led'
  | 'generic-diode'
  | 'zener-diode'
  | 'photodiode'
  | 'seven-segment-display'
  | 'npn-transistor'
  | 'pnp-transistor'
  | 'nmos'
  | 'pmos'
  | 'spst-switch'
  | 'toggle-switch'
  | 'pushbutton'
  | 'dip-switch'
  | 'rotary-switch'
  | 'timer-555'
  | 'op-amp'
  | 'comparator'
  | 'dip-8-ic'
  | 'dip-14-ic'
  | 'dip-16-ic'
  | 'and-gate'
  | 'or-gate'
  | 'not-gate'
  | 'nand-gate'
  | 'nor-gate'
  | 'xor-gate'
  | 'binary-counter'
  | 'shift-register'
  | 'fuse'
  | 'relay'
  | 'buzzer'
  | 'speaker'
  | 'lamp'
  | 'motor'
  | 'microphone'
  | 'hall-sensor'
  | 'reed-switch'
  | 'light-sensor-module'
  | 'temperature-sensor'
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
  color: 'red' | 'green' | 'yellow' | 'blue' | 'ir';
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

export type GenericProps = Record<string, string | number | boolean>;

export type PlacedComponent = BasePlacedComponent<ComponentType, Record<string, string | number | boolean>>;

export interface ComponentPropertyDefinition {
  key: string;
  label: string;
  type: 'number' | 'boolean' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string | number | boolean }>;
}

export interface TerminalTemplate {
  id: string;
  label: string;
  offset: number;
}

export interface LearningMetadata {
  level: 'beginner' | 'intermediate';
  plainExplanation: string;
  commonUses: string[];
  commonMistakes: string[];
  relatedLessonTags: string[];
}

export interface ComponentDefinition {
  type: ComponentType;
  displayName: string;
  shortName: string;
  category: ComponentCategory;
  subcategory: string;
  aliases: string[];
  description: string;
  simulationSupport: SimulationSupportTier;
  terminals: TerminalTemplate[];
  defaultProperties: GenericProps;
  editableProperties: ComponentPropertyDefinition[];
  placementRules: {
    canPlaceOnBoard: boolean;
    preferredTerminalSpan: number;
  };
  visual2D: {
    family: string;
    icon: string;
    accentColor: string;
    polarity: 'none' | 'polarized';
  };
  preview: {
    family: string;
    preferredKind: '2d' | '3d';
    asset3d?: string;
  };
  learning: LearningMetadata;
  tutorVocabulary: string[];
  searchTags: string[];
}

const baseTwoTerminal = (offset = 1): TerminalTemplate[] => [
  { id: 'terminalA', label: 'A', offset: 0 },
  { id: 'terminalB', label: 'B', offset },
];

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    type: 'dc-power-supply',
    displayName: 'DC Power Supply',
    shortName: 'VCC',
    category: 'Power',
    subcategory: 'Sources',
    aliases: ['vcc', 'supply'],
    description: 'Stable DC source for breadboard rails.',
    simulationSupport: 'full',
    terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }],
    defaultProperties: { voltage: 5, isOn: true },
    editableProperties: [{ key: 'voltage', label: 'Voltage (V)', type: 'number', min: 1, max: 24, step: 0.1 }, { key: 'isOn', label: 'Enabled', type: 'boolean' }],
    placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 },
    visual2D: { family: 'supply', icon: '⎓', accentColor: '#22d3ee', polarity: 'polarized' },
    preview: { family: 'source', preferredKind: '2d' },
    learning: {
      level: 'beginner',
      plainExplanation: 'Provides electrical pressure that pushes current through your circuit.',
      commonUses: ['Power rails', 'Testing LED circuits'],
      commonMistakes: ['Using too high voltage for LEDs'],
      relatedLessonTags: ['power-basics', 'closed-loop'],
    },
    tutorVocabulary: ['dc source', 'bench voltage'],
    searchTags: ['power', 'source', 'voltage'],
  },
  {
    type: 'bench-power-supply', displayName: 'Bench Supply', shortName: 'PSU', category: 'Power', subcategory: 'Sources', aliases: ['lab supply'],
    description: 'Adjustable bench-style power source.', simulationSupport: 'partial', terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }],
    defaultProperties: { voltage: 12, currentLimitMa: 500, isOn: true }, editableProperties: [{ key: 'voltage', label: 'Voltage (V)', type: 'number', min: 1, max: 30, step: 0.1 }, { key: 'currentLimitMa', label: 'Current Limit (mA)', type: 'number', min: 10, max: 2000, step: 10 }],
    placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'supply', icon: '🔋', accentColor: '#38bdf8', polarity: 'polarized' }, preview: { family: 'source', preferredKind: '2d' },
    learning: { level: 'intermediate', plainExplanation: 'Represents adjustable lab power with optional current limiting.', commonUses: ['Prototyping', 'Supply sweeps'], commonMistakes: ['Ignoring current limit settings'], relatedLessonTags: ['power-instruments'] }, tutorVocabulary: ['bench supply'], searchTags: ['psu', 'source']
  },
  {
    type: 'battery-source', displayName: 'Battery', shortName: 'BAT', category: 'Power', subcategory: 'Sources', aliases: ['cell'],
    description: 'Portable battery style source.', simulationSupport: 'partial', terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }],
    defaultProperties: { voltage: 9 }, editableProperties: [{ key: 'voltage', label: 'Battery Voltage (V)', type: 'number', min: 1.5, max: 12, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 },
    visual2D: { family: 'battery', icon: '▮▯', accentColor: '#0ea5e9', polarity: 'polarized' }, preview: { family: 'battery', preferredKind: '2d' },
    learning: { level: 'beginner', plainExplanation: 'A chemical energy source converted into circuit voltage.', commonUses: ['Portable circuits'], commonMistakes: ['Reversing polarity'], relatedLessonTags: ['power-basics'] }, tutorVocabulary: ['battery'], searchTags: ['power', 'battery']
  },
  {
    type: 'ground', displayName: 'Ground', shortName: 'GND', category: 'Breadboard Helpers', subcategory: 'Reference', aliases: ['0v'],
    description: 'Reference return node.', simulationSupport: 'full', terminals: [{ id: 'gnd', label: '⏚', offset: 0 }], defaultProperties: { symbol: 'earth' }, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 0 },
    visual2D: { family: 'reference', icon: '⏚', accentColor: '#94a3b8', polarity: 'none' }, preview: { family: 'reference', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'A shared zero-volt reference point for your circuit.', commonUses: ['Return path'], commonMistakes: ['Leaving floating grounds'], relatedLessonTags: ['closed-loop'] }, tutorVocabulary: ['ground'], searchTags: ['reference', 'return']
  },
  {
    type: 'resistor', displayName: 'Resistor', shortName: 'R', category: 'Passive', subcategory: 'Resistive', aliases: ['ohmic'], description: 'Limits current and sets divider ratios.', simulationSupport: 'full', terminals: baseTwoTerminal(), defaultProperties: { resistanceOhms: 1000 }, editableProperties: [{ key: 'resistanceOhms', label: 'Resistance (Ω)', type: 'number', min: 1, max: 10000000, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'axial-resistor', icon: 'Ω', accentColor: '#f59e0b', polarity: 'none' }, preview: { family: 'axial-resistor', preferredKind: '3d', asset3d: '/assets/previews/resistor.glb' }, learning: { level: 'beginner', plainExplanation: 'Opposes current flow and creates voltage drops.', commonUses: ['LED current limiting', 'Voltage dividers'], commonMistakes: ['Wrong magnitude'], relatedLessonTags: ['ohms-law'] }, tutorVocabulary: ['resistor'], searchTags: ['ohm', 'limit current']
  },
  { type: 'capacitor', displayName: 'Capacitor (Legacy)', shortName: 'C', category: 'Passive', subcategory: 'Capacitors', aliases: ['legacy capacitor'], description: 'Legacy capacitor entry kept for compatibility.', simulationSupport: 'full', terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }], defaultProperties: { capacitanceUf: 10 }, editableProperties: [{ key: 'capacitanceUf', label: 'Capacitance (µF)', type: 'number', min: 0.1, max: 10000, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'electrolytic', icon: '∥', accentColor: '#10b981', polarity: 'polarized' }, preview: { family: 'electrolytic-capacitor', preferredKind: '3d', asset3d: '/assets/previews/capacitor.glb' }, learning: { level: 'beginner', plainExplanation: 'Stores charge and smooths changing signals.', commonUses: ['Timing', 'Filtering'], commonMistakes: ['Wrong polarity'], relatedLessonTags: ['rc-timing'] }, tutorVocabulary: ['capacitor'], searchTags: ['charge', 'timing'] },
  { type: 'ceramic-capacitor', displayName: 'Ceramic Capacitor', shortName: 'C-cer', category: 'Passive', subcategory: 'Capacitors', aliases: ['mlcc'], description: 'Non-polarized high-frequency capacitor.', simulationSupport: 'partial', terminals: baseTwoTerminal(), defaultProperties: { capacitanceUf: 0.1 }, editableProperties: [{ key: 'capacitanceUf', label: 'Capacitance (µF)', type: 'number', min: 0.001, max: 10, step: 0.001 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'ceramic-capacitor', icon: '∥', accentColor: '#14b8a6', polarity: 'none' }, preview: { family: 'ceramic-capacitor', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Small non-polarized capacitor for decoupling and filtering.', commonUses: ['Bypass near ICs'], commonMistakes: ['Ignoring unit prefixes'], relatedLessonTags: ['decoupling'] }, tutorVocabulary: ['ceramic capacitor'], searchTags: ['mlcc', 'decoupling'] },
  { type: 'electrolytic-capacitor', displayName: 'Electrolytic Capacitor', shortName: 'C-elec', category: 'Passive', subcategory: 'Capacitors', aliases: ['electrolytic'], description: 'Polarized capacitor for larger capacitance.', simulationSupport: 'partial', terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }], defaultProperties: { capacitanceUf: 100 }, editableProperties: [{ key: 'capacitanceUf', label: 'Capacitance (µF)', type: 'number', min: 1, max: 10000, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'electrolytic', icon: '∥', accentColor: '#059669', polarity: 'polarized' }, preview: { family: 'electrolytic-capacitor', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Larger polarized capacitor for smoothing and timing.', commonUses: ['Power smoothing'], commonMistakes: ['Reversed polarity'], relatedLessonTags: ['filtering'] }, tutorVocabulary: ['electrolytic capacitor'], searchTags: ['polarized capacitor'] },
  { type: 'potentiometer', displayName: 'Potentiometer', shortName: 'POT', category: 'Passive', subcategory: 'Variable Resistive', aliases: ['pot'], description: 'Adjustable resistor with wiper terminal.', simulationSupport: 'partial', terminals: [{ id: 'terminalA', label: 'A', offset: 0 }, { id: 'wiper', label: 'W', offset: 1 }, { id: 'terminalB', label: 'B', offset: 2 }], defaultProperties: { resistanceOhms: 10000, wiperRatio: 0.5 }, editableProperties: [{ key: 'resistanceOhms', label: 'Total Resistance (Ω)', type: 'number', min: 100, max: 1000000, step: 100 }, { key: 'wiperRatio', label: 'Wiper Position', type: 'number', min: 0, max: 1, step: 0.01 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'potentiometer', icon: '◍', accentColor: '#22c55e', polarity: 'none' }, preview: { family: 'potentiometer', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'A variable divider controlled by a wiper.', commonUses: ['Volume and calibration'], commonMistakes: ['Not using wiper correctly'], relatedLessonTags: ['voltage-divider'] }, tutorVocabulary: ['pot', 'variable resistor'], searchTags: ['knob', 'adjustable'] },
  { type: 'trim-potentiometer', displayName: 'Trim Potentiometer', shortName: 'TRIM', category: 'Passive', subcategory: 'Variable Resistive', aliases: ['trimpot'], description: 'Small board-adjustable potentiometer for calibration.', simulationSupport: 'partial', terminals: [{ id: 'terminalA', label: 'A', offset: 0 }, { id: 'wiper', label: 'W', offset: 1 }, { id: 'terminalB', label: 'B', offset: 2 }], defaultProperties: { resistanceOhms: 5000, wiperRatio: 0.5 }, editableProperties: [{ key: 'wiperRatio', label: 'Wiper Position', type: 'number', min: 0, max: 1, step: 0.01 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'potentiometer', icon: '◎', accentColor: '#16a34a', polarity: 'none' }, preview: { family: 'potentiometer', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Fine adjustment resistor used for one-time tuning.', commonUses: ['Calibration'], commonMistakes: ['Assuming it is a user-facing knob'], relatedLessonTags: ['calibration'] }, tutorVocabulary: ['trim pot'], searchTags: ['trimpot'] },
  { type: 'photoresistor', displayName: 'Photoresistor (LDR)', shortName: 'LDR', category: 'Sensors', subcategory: 'Light', aliases: ['ldr'], description: 'Resistance changes with light intensity.', simulationSupport: 'partial', terminals: baseTwoTerminal(), defaultProperties: { darkResistanceOhms: 50000, litResistanceOhms: 1000 }, editableProperties: [{ key: 'darkResistanceOhms', label: 'Dark Resistance (Ω)', type: 'number', min: 1000, max: 1000000, step: 1000 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'sensor', icon: '☀', accentColor: '#eab308', polarity: 'none' }, preview: { family: 'sensor', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Light-dependent resistor used to sense ambient brightness.', commonUses: ['Night lights'], commonMistakes: ['Expecting linear response'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['ldr'], searchTags: ['light sensor'] },
  { type: 'thermistor', displayName: 'Thermistor', shortName: 'NTC', category: 'Sensors', subcategory: 'Temperature', aliases: ['ntc'], description: 'Temperature-dependent resistor.', simulationSupport: 'partial', terminals: baseTwoTerminal(), defaultProperties: { nominalResistanceOhms: 10000 }, editableProperties: [{ key: 'nominalResistanceOhms', label: 'Nominal Resistance (Ω)', type: 'number', min: 1000, max: 100000, step: 100 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'sensor', icon: '℃', accentColor: '#fb923c', polarity: 'none' }, preview: { family: 'sensor', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Resistor that changes value as temperature changes.', commonUses: ['Temperature measurement'], commonMistakes: ['Wrong pull-up values'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['thermistor'], searchTags: ['temperature sensor resistor'] },
  { type: 'led', displayName: 'LED', shortName: 'LED', category: 'Diodes & Light', subcategory: 'Emitters', aliases: ['light emitting diode'], description: 'Light-emitting diode indicator.', simulationSupport: 'full', terminals: [{ id: 'anode', label: 'A', offset: 0 }, { id: 'cathode', label: 'K', offset: 1 }], defaultProperties: { color: 'red', forwardVoltage: 2 }, editableProperties: [{ key: 'color', label: 'Color', type: 'select', options: [{ label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }, { label: 'Yellow', value: 'yellow' }, { label: 'Blue', value: 'blue' }] }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'led-5mm', icon: '◉', accentColor: '#ef4444', polarity: 'polarized' }, preview: { family: 'led-5mm', preferredKind: '3d', asset3d: '/assets/previews/led.glb' }, learning: { level: 'beginner', plainExplanation: 'A diode that emits light when forward biased.', commonUses: ['Indicators'], commonMistakes: ['Reversing anode/cathode'], relatedLessonTags: ['diodes'] }, tutorVocabulary: ['led'], searchTags: ['light'] },
  { type: 'ir-led', displayName: 'IR LED', shortName: 'IR LED', category: 'Diodes & Light', subcategory: 'Emitters', aliases: ['infrared led'], description: 'Infrared emitting diode.', simulationSupport: 'partial', terminals: [{ id: 'anode', label: 'A', offset: 0 }, { id: 'cathode', label: 'K', offset: 1 }], defaultProperties: { forwardVoltage: 1.3 }, editableProperties: [{ key: 'forwardVoltage', label: 'Forward Voltage (V)', type: 'number', min: 1, max: 2, step: 0.05 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'led-5mm', icon: '◌', accentColor: '#a855f7', polarity: 'polarized' }, preview: { family: 'led-5mm', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'LED that emits infrared light, usually invisible to eyes.', commonUses: ['Remote controls'], commonMistakes: ['Expecting visible glow'], relatedLessonTags: ['diodes'] }, tutorVocabulary: ['infrared led'], searchTags: ['ir'] },
  { type: 'generic-diode', displayName: 'Diode', shortName: 'D', category: 'Diodes & Light', subcategory: 'Rectifiers', aliases: ['rectifier diode'], description: 'One-way current component.', simulationSupport: 'partial', terminals: [{ id: 'anode', label: 'A', offset: 0 }, { id: 'cathode', label: 'K', offset: 1 }], defaultProperties: { forwardDropV: 0.7 }, editableProperties: [{ key: 'forwardDropV', label: 'Forward Drop (V)', type: 'number', min: 0.2, max: 1.2, step: 0.05 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'axial-diode', icon: '▶|', accentColor: '#f97316', polarity: 'polarized' }, preview: { family: 'axial-diode', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Lets current flow primarily in one direction.', commonUses: ['Rectification', 'Reverse protection'], commonMistakes: ['Installing backwards'], relatedLessonTags: ['diodes'] }, tutorVocabulary: ['diode'], searchTags: ['rectifier'] },
  { type: 'zener-diode', displayName: 'Zener Diode', shortName: 'ZD', category: 'Diodes & Light', subcategory: 'Protection', aliases: ['zener'], description: 'Breakdown diode for reference/protection.', simulationSupport: 'reference', terminals: [{ id: 'anode', label: 'A', offset: 0 }, { id: 'cathode', label: 'K', offset: 1 }], defaultProperties: { zenerVoltage: 5.1 }, editableProperties: [{ key: 'zenerVoltage', label: 'Zener Voltage (V)', type: 'number', min: 2.4, max: 24, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'axial-diode', icon: 'Z', accentColor: '#fb7185', polarity: 'polarized' }, preview: { family: 'axial-diode', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Operates in reverse breakdown for voltage clamping/reference.', commonUses: ['Shunt regulator', 'Protection'], commonMistakes: ['Using without resistor'], relatedLessonTags: ['protection'] }, tutorVocabulary: ['zener'], searchTags: ['clamp'] },
  { type: 'photodiode', displayName: 'Photodiode', shortName: 'PD', category: 'Diodes & Light', subcategory: 'Sensors', aliases: ['light diode'], description: 'Light-sensitive diode.', simulationSupport: 'reference', terminals: [{ id: 'anode', label: 'A', offset: 0 }, { id: 'cathode', label: 'K', offset: 1 }], defaultProperties: { sensitivity: 1 }, editableProperties: [{ key: 'sensitivity', label: 'Sensitivity', type: 'number', min: 0.1, max: 5, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'sensor', icon: '◐', accentColor: '#facc15', polarity: 'polarized' }, preview: { family: 'sensor', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Converts incoming light into small electrical current.', commonUses: ['Optical sensing'], commonMistakes: ['Confusing with LED'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['photodiode'], searchTags: ['light detector'] },
  { type: 'seven-segment-display', displayName: 'Seven Segment Display', shortName: '7SEG', category: 'Output Devices', subcategory: 'Displays', aliases: ['7 segment'], description: 'Numeric display made of LED segments.', simulationSupport: 'reference', terminals: [{ id: 'common', label: 'COM', offset: 0 }, { id: 'segmentA', label: 'a', offset: 1 }, { id: 'segmentB', label: 'b', offset: 2 }], defaultProperties: { commonType: 'common-cathode' }, editableProperties: [{ key: 'commonType', label: 'Common Type', type: 'select', options: [{ label: 'Common Cathode', value: 'common-cathode' }, { label: 'Common Anode', value: 'common-anode' }] }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'display', icon: '8', accentColor: '#ef4444', polarity: 'polarized' }, preview: { family: 'display', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'A set of seven LEDs arranged to display digits.', commonUses: ['Counters', 'Timers'], commonMistakes: ['Wrong common type wiring'], relatedLessonTags: ['digital-output'] }, tutorVocabulary: ['seven segment'], searchTags: ['display'] },
  { type: 'npn-transistor', displayName: 'NPN Transistor', shortName: 'NPN', category: 'Transistors', subcategory: 'BJT', aliases: ['bjt'], description: 'Current-controlled transistor switch.', simulationSupport: 'full', terminals: [{ id: 'base', label: 'B', offset: 0 }, { id: 'collector', label: 'C', offset: 1 }, { id: 'emitter', label: 'E', offset: 2 }], defaultProperties: { beta: 100 }, editableProperties: [{ key: 'beta', label: 'Beta (hFE)', type: 'number', min: 20, max: 400, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'to92', icon: 'N', accentColor: '#a78bfa', polarity: 'none' }, preview: { family: 'to92-transistor', preferredKind: '3d', asset3d: '/assets/previews/npn-transistor.glb' }, learning: { level: 'intermediate', plainExplanation: 'Uses small base current to control larger collector current.', commonUses: ['Switching'], commonMistakes: ['Pinout confusion'], relatedLessonTags: ['transistors'] }, tutorVocabulary: ['npn'], searchTags: ['bjt'] },
  { type: 'pnp-transistor', displayName: 'PNP Transistor', shortName: 'PNP', category: 'Transistors', subcategory: 'BJT', aliases: ['pnp bjt'], description: 'Complementary BJT type.', simulationSupport: 'reference', terminals: [{ id: 'base', label: 'B', offset: 0 }, { id: 'collector', label: 'C', offset: 1 }, { id: 'emitter', label: 'E', offset: 2 }], defaultProperties: { beta: 120 }, editableProperties: [{ key: 'beta', label: 'Beta (hFE)', type: 'number', min: 20, max: 400, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'to92', icon: 'P', accentColor: '#c084fc', polarity: 'none' }, preview: { family: 'to92-transistor', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'PNP transistor controls current opposite to NPN conventions.', commonUses: ['High-side switching'], commonMistakes: ['Using NPN biasing rules'], relatedLessonTags: ['transistors'] }, tutorVocabulary: ['pnp'], searchTags: ['bjt'] },
  { type: 'nmos', displayName: 'N-Channel MOSFET', shortName: 'NMOS', category: 'Transistors', subcategory: 'MOSFET', aliases: ['nmosfet'], description: 'Voltage-controlled N-channel MOSFET.', simulationSupport: 'partial', terminals: [{ id: 'gate', label: 'G', offset: 0 }, { id: 'drain', label: 'D', offset: 1 }, { id: 'source', label: 'S', offset: 2 }], defaultProperties: { thresholdV: 2.5 }, editableProperties: [{ key: 'thresholdV', label: 'Threshold (V)', type: 'number', min: 1, max: 5, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'to220', icon: 'N⎍', accentColor: '#8b5cf6', polarity: 'none' }, preview: { family: 'to220-transistor', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Gate voltage controls drain-source conduction.', commonUses: ['Motor switching'], commonMistakes: ['Not sharing ground with driver'], relatedLessonTags: ['mosfet'] }, tutorVocabulary: ['nmos'], searchTags: ['mosfet'] },
  { type: 'pmos', displayName: 'P-Channel MOSFET', shortName: 'PMOS', category: 'Transistors', subcategory: 'MOSFET', aliases: ['pmosfet'], description: 'Voltage-controlled P-channel MOSFET.', simulationSupport: 'reference', terminals: [{ id: 'gate', label: 'G', offset: 0 }, { id: 'drain', label: 'D', offset: 1 }, { id: 'source', label: 'S', offset: 2 }], defaultProperties: { thresholdV: -2.5 }, editableProperties: [{ key: 'thresholdV', label: 'Threshold (V)', type: 'number', min: -5, max: -1, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'to220', icon: 'P⎍', accentColor: '#a855f7', polarity: 'none' }, preview: { family: 'to220-transistor', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'P-channel MOSFET commonly used for high-side switching.', commonUses: ['Power path control'], commonMistakes: ['Driving gate with wrong polarity'], relatedLessonTags: ['mosfet'] }, tutorVocabulary: ['pmos'], searchTags: ['mosfet'] },
  { type: 'spst-switch', displayName: 'SPST Switch', shortName: 'SW', category: 'Switches & Controls', subcategory: 'Switches', aliases: ['single pole single throw'], description: 'Simple on/off switch.', simulationSupport: 'full', terminals: baseTwoTerminal(), defaultProperties: { isClosed: false }, editableProperties: [{ key: 'isClosed', label: 'Closed', type: 'boolean' }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'switch', icon: '⏻', accentColor: '#f97316', polarity: 'none' }, preview: { family: 'switch', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Manually opens or closes a connection.', commonUses: ['User input'], commonMistakes: ['Assuming default closed state'], relatedLessonTags: ['switches'] }, tutorVocabulary: ['switch'], searchTags: ['on off'] },
  { type: 'toggle-switch', displayName: 'Toggle Switch', shortName: 'TGL', category: 'Switches & Controls', subcategory: 'Switches', aliases: ['toggle'], description: 'Lever-style latching switch.', simulationSupport: 'partial', terminals: baseTwoTerminal(), defaultProperties: { isClosed: false }, editableProperties: [{ key: 'isClosed', label: 'Closed', type: 'boolean' }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'switch', icon: '⇅', accentColor: '#fb923c', polarity: 'none' }, preview: { family: 'switch', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'A maintained-position switch for persistent state.', commonUses: ['Mode select'], commonMistakes: ['Using when momentary input is needed'], relatedLessonTags: ['switches'] }, tutorVocabulary: ['toggle'], searchTags: ['latching'] },
  { type: 'pushbutton', displayName: 'Pushbutton', shortName: 'BTN', category: 'Switches & Controls', subcategory: 'Switches', aliases: ['momentary switch'], description: 'Momentary contact switch.', simulationSupport: 'partial', terminals: baseTwoTerminal(), defaultProperties: { isClosed: false }, editableProperties: [{ key: 'isClosed', label: 'Pressed', type: 'boolean' }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'pushbutton', icon: '●', accentColor: '#f59e0b', polarity: 'none' }, preview: { family: 'pushbutton', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Closes only while pressed.', commonUses: ['Reset buttons'], commonMistakes: ['Missing pull-up/down resistor'], relatedLessonTags: ['digital-inputs'] }, tutorVocabulary: ['push button'], searchTags: ['button'] },
  { type: 'dip-switch', displayName: 'DIP Switch', shortName: 'DIP SW', category: 'Switches & Controls', subcategory: 'Switches', aliases: ['dip'], description: 'Multi-toggle switch package.', simulationSupport: 'reference', terminals: [{ id: 's1', label: '1', offset: 0 }, { id: 's2', label: '2', offset: 1 }, { id: 's3', label: '3', offset: 2 }], defaultProperties: { channels: 4 }, editableProperties: [{ key: 'channels', label: 'Channels', type: 'number', min: 2, max: 8, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'switch-bank', icon: '▤', accentColor: '#fb7185', polarity: 'none' }, preview: { family: 'dip-package', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'A bank of mini switches in one package.', commonUses: ['Configuration options'], commonMistakes: ['Misreading switch numbering'], relatedLessonTags: ['digital-inputs'] }, tutorVocabulary: ['dip switch'], searchTags: ['configuration'] },
  { type: 'rotary-switch', displayName: 'Rotary Switch', shortName: 'ROT', category: 'Switches & Controls', subcategory: 'Switches', aliases: ['selector switch'], description: 'Selects one of several positions.', simulationSupport: 'reference', terminals: [{ id: 'common', label: 'C', offset: 0 }, { id: 'throw1', label: '1', offset: 1 }, { id: 'throw2', label: '2', offset: 2 }], defaultProperties: { positions: 3 }, editableProperties: [{ key: 'positions', label: 'Positions', type: 'number', min: 2, max: 12, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'switch', icon: '↻', accentColor: '#f97316', polarity: 'none' }, preview: { family: 'switch', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Routes common terminal to one selected output.', commonUses: ['Range selectors'], commonMistakes: ['Wrong position indexing'], relatedLessonTags: ['switches'] }, tutorVocabulary: ['rotary switch'], searchTags: ['selector'] },
  { type: 'timer-555', displayName: '555 Timer', shortName: 'NE555', category: 'Timing & Analog', subcategory: 'Timers', aliases: ['ne555'], description: 'Iconic timing and pulse-generation IC.', simulationSupport: 'partial', terminals: [{ id: 'gnd', label: '1', offset: 0 }, { id: 'vcc', label: '8', offset: 3 }, { id: 'out', label: '3', offset: 1 }], defaultProperties: { mode: 'astable', frequencyHz: 1 }, editableProperties: [{ key: 'mode', label: 'Mode', type: 'select', options: [{ label: 'Astable', value: 'astable' }, { label: 'Monostable', value: 'monostable' }] }, { key: 'frequencyHz', label: 'Frequency (Hz)', type: 'number', min: 0.1, max: 5000, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 3 }, visual2D: { family: 'dip-8', icon: '555', accentColor: '#60a5fa', polarity: 'none' }, preview: { family: 'dip-8', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Produces timed pulses and oscillations.', commonUses: ['Blinkers', 'Delays'], commonMistakes: ['Pin misunderstanding'], relatedLessonTags: ['timers'] }, tutorVocabulary: ['555 timer'], searchTags: ['oscillator'] },
  { type: 'op-amp', displayName: 'Generic Op-Amp', shortName: 'OPAMP', category: 'Timing & Analog', subcategory: 'Amplifiers', aliases: ['operational amplifier'], description: 'Differential amplifier block.', simulationSupport: 'reference', terminals: [{ id: 'in+', label: '+', offset: 0 }, { id: 'in-', label: '-', offset: 1 }, { id: 'out', label: 'OUT', offset: 2 }], defaultProperties: { gain: 100000 }, editableProperties: [{ key: 'gain', label: 'Open Loop Gain', type: 'number', min: 1000, max: 1000000, step: 1000 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'analog-ic', icon: '△', accentColor: '#3b82f6', polarity: 'none' }, preview: { family: 'dip-8', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Amplifies difference between two input voltages.', commonUses: ['Filters', 'Comparators'], commonMistakes: ['Ignoring supply rails'], relatedLessonTags: ['analog'] }, tutorVocabulary: ['op amp'], searchTags: ['amplifier'] },
  { type: 'comparator', displayName: 'Comparator', shortName: 'COMP', category: 'Timing & Analog', subcategory: 'Comparators', aliases: ['voltage comparator'], description: 'Compares two voltages and outputs digital-like result.', simulationSupport: 'reference', terminals: [{ id: 'in+', label: '+', offset: 0 }, { id: 'in-', label: '-', offset: 1 }, { id: 'out', label: 'OUT', offset: 2 }], defaultProperties: { thresholdV: 2.5 }, editableProperties: [{ key: 'thresholdV', label: 'Threshold (V)', type: 'number', min: 0, max: 24, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'analog-ic', icon: '≷', accentColor: '#2563eb', polarity: 'none' }, preview: { family: 'dip-8', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Switches output when one input exceeds the other.', commonUses: ['Threshold detection'], commonMistakes: ['No hysteresis'], relatedLessonTags: ['analog'] }, tutorVocabulary: ['comparator'], searchTags: ['threshold'] },
  { type: 'dip-8-ic', displayName: 'DIP-8 IC Placeholder', shortName: 'DIP-8', category: 'Integrated Circuits', subcategory: 'Packages', aliases: ['8 pin ic'], description: 'Generic DIP-8 package for planning and learning pin maps.', simulationSupport: 'reference', terminals: [{ id: 'pin1', label: '1', offset: 0 }, { id: 'pin8', label: '8', offset: 3 }], defaultProperties: { label: 'DIP-8' }, editableProperties: [{ key: 'label', label: 'Label', type: 'select', options: [{ label: 'DIP-8', value: 'DIP-8' }, { label: 'Custom IC', value: 'IC' }] }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 3 }, visual2D: { family: 'dip-8', icon: 'IC8', accentColor: '#64748b', polarity: 'none' }, preview: { family: 'dip-8', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Package placeholder to teach pin numbering and orientation.', commonUses: ['Planning IC layouts'], commonMistakes: ['Notching orientation confusion'], relatedLessonTags: ['ic-packages'] }, tutorVocabulary: ['dip 8'], searchTags: ['ic'] },
  { type: 'dip-14-ic', displayName: 'DIP-14 IC Placeholder', shortName: 'DIP-14', category: 'Integrated Circuits', subcategory: 'Packages', aliases: ['14 pin ic'], description: 'Generic DIP-14 package placeholder.', simulationSupport: 'reference', terminals: [{ id: 'pin1', label: '1', offset: 0 }, { id: 'pin14', label: '14', offset: 3 }], defaultProperties: { label: 'DIP-14' }, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 3 }, visual2D: { family: 'dip-14', icon: 'IC14', accentColor: '#64748b', polarity: 'none' }, preview: { family: 'dip-14', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Package placeholder to reason about standard 14-pin ICs.', commonUses: ['Logic IC layout'], commonMistakes: ['Wrong side pin numbering'], relatedLessonTags: ['ic-packages'] }, tutorVocabulary: ['dip 14'], searchTags: ['ic'] },
  { type: 'dip-16-ic', displayName: 'DIP-16 IC Placeholder', shortName: 'DIP-16', category: 'Integrated Circuits', subcategory: 'Packages', aliases: ['16 pin ic'], description: 'Generic DIP-16 package placeholder.', simulationSupport: 'reference', terminals: [{ id: 'pin1', label: '1', offset: 0 }, { id: 'pin16', label: '16', offset: 3 }], defaultProperties: { label: 'DIP-16' }, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 3 }, visual2D: { family: 'dip-16', icon: 'IC16', accentColor: '#64748b', polarity: 'none' }, preview: { family: 'dip-16', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Package placeholder to teach larger DIP pin maps.', commonUses: ['Interface IC planning'], commonMistakes: ['Forgetting pin 1 marker'], relatedLessonTags: ['ic-packages'] }, tutorVocabulary: ['dip 16'], searchTags: ['ic'] },
  { type: 'clock-source', displayName: 'Clock Source', shortName: 'CLK', category: 'Digital Logic', subcategory: 'Sources', aliases: ['clock generator'], description: 'Digital pulse source block.', simulationSupport: 'partial', terminals: [{ id: 'out', label: 'OUT', offset: 0 }, { id: 'gnd', label: 'GND', offset: 1 }], defaultProperties: { frequencyHz: 1 }, editableProperties: [{ key: 'frequencyHz', label: 'Frequency (Hz)', type: 'number', min: 0.1, max: 1000000, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'digital-source', icon: '⌁', accentColor: '#22c55e', polarity: 'none' }, preview: { family: 'digital', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Provides regular timing pulses for digital circuits.', commonUses: ['Counters', 'Shift registers'], commonMistakes: ['Frequency set too high for observation'], relatedLessonTags: ['digital-timing'] }, tutorVocabulary: ['clock source'], searchTags: ['timing'] },
  { type: 'and-gate', displayName: 'AND Gate', shortName: 'AND', category: 'Digital Logic', subcategory: 'Gates', aliases: ['logic and'], description: 'Outputs HIGH only when all inputs are HIGH.', simulationSupport: 'reference', terminals: [{ id: 'in1', label: 'A', offset: 0 }, { id: 'in2', label: 'B', offset: 1 }, { id: 'out', label: 'Y', offset: 2 }], defaultProperties: {}, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'logic-gate', icon: '&', accentColor: '#34d399', polarity: 'none' }, preview: { family: 'digital', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Boolean AND operation block.', commonUses: ['Enable conditions'], commonMistakes: ['Ignoring floating inputs'], relatedLessonTags: ['logic-basics'] }, tutorVocabulary: ['and gate'], searchTags: ['logic'] },
  { type: 'or-gate', displayName: 'OR Gate', shortName: 'OR', category: 'Digital Logic', subcategory: 'Gates', aliases: ['logic or'], description: 'Outputs HIGH when any input is HIGH.', simulationSupport: 'reference', terminals: [{ id: 'in1', label: 'A', offset: 0 }, { id: 'in2', label: 'B', offset: 1 }, { id: 'out', label: 'Y', offset: 2 }], defaultProperties: {}, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'logic-gate', icon: '≥1', accentColor: '#34d399', polarity: 'none' }, preview: { family: 'digital', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Boolean OR operation block.', commonUses: ['Condition combining'], commonMistakes: ['Confusing OR with XOR'], relatedLessonTags: ['logic-basics'] }, tutorVocabulary: ['or gate'], searchTags: ['logic'] },
  { type: 'not-gate', displayName: 'NOT Gate', shortName: 'NOT', category: 'Digital Logic', subcategory: 'Gates', aliases: ['inverter'], description: 'Outputs inverted input.', simulationSupport: 'reference', terminals: [{ id: 'in', label: 'A', offset: 0 }, { id: 'out', label: 'Y', offset: 1 }], defaultProperties: {}, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'logic-gate', icon: '¬', accentColor: '#34d399', polarity: 'none' }, preview: { family: 'digital', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Inverts digital signal state.', commonUses: ['Signal inversion'], commonMistakes: ['Missing truth table mapping'], relatedLessonTags: ['logic-basics'] }, tutorVocabulary: ['not gate'], searchTags: ['logic'] },
  { type: 'nand-gate', displayName: 'NAND Gate', shortName: 'NAND', category: 'Digital Logic', subcategory: 'Gates', aliases: ['not and'], description: 'NOT-AND universal gate.', simulationSupport: 'reference', terminals: [{ id: 'in1', label: 'A', offset: 0 }, { id: 'in2', label: 'B', offset: 1 }, { id: 'out', label: 'Y', offset: 2 }], defaultProperties: {}, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'logic-gate', icon: '⊼', accentColor: '#34d399', polarity: 'none' }, preview: { family: 'digital', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Output LOW only when all inputs are HIGH.', commonUses: ['Universal logic'], commonMistakes: ['Forgetting inversion bubble'], relatedLessonTags: ['logic-basics'] }, tutorVocabulary: ['nand gate'], searchTags: ['logic'] },
  { type: 'nor-gate', displayName: 'NOR Gate', shortName: 'NOR', category: 'Digital Logic', subcategory: 'Gates', aliases: ['not or'], description: 'NOT-OR universal gate.', simulationSupport: 'reference', terminals: [{ id: 'in1', label: 'A', offset: 0 }, { id: 'in2', label: 'B', offset: 1 }, { id: 'out', label: 'Y', offset: 2 }], defaultProperties: {}, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'logic-gate', icon: '⊽', accentColor: '#34d399', polarity: 'none' }, preview: { family: 'digital', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Output HIGH only when all inputs are LOW.', commonUses: ['Latches'], commonMistakes: ['Confusing with OR'], relatedLessonTags: ['logic-basics'] }, tutorVocabulary: ['nor gate'], searchTags: ['logic'] },
  { type: 'xor-gate', displayName: 'XOR Gate', shortName: 'XOR', category: 'Digital Logic', subcategory: 'Gates', aliases: ['exclusive or'], description: 'Outputs HIGH when inputs differ.', simulationSupport: 'reference', terminals: [{ id: 'in1', label: 'A', offset: 0 }, { id: 'in2', label: 'B', offset: 1 }, { id: 'out', label: 'Y', offset: 2 }], defaultProperties: {}, editableProperties: [], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'logic-gate', icon: '⊕', accentColor: '#34d399', polarity: 'none' }, preview: { family: 'digital', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'True when exactly one input is true.', commonUses: ['Parity', 'Adders'], commonMistakes: ['Using as OR'], relatedLessonTags: ['logic-basics'] }, tutorVocabulary: ['xor gate'], searchTags: ['logic'] },
  { type: 'binary-counter', displayName: 'Binary Counter Placeholder', shortName: 'CTR', category: 'Digital Logic', subcategory: 'Sequential', aliases: ['counter'], description: 'Counts clock pulses in binary.', simulationSupport: 'reference', terminals: [{ id: 'clk', label: 'CLK', offset: 0 }, { id: 'q0', label: 'Q0', offset: 1 }, { id: 'q1', label: 'Q1', offset: 2 }], defaultProperties: { bits: 4 }, editableProperties: [{ key: 'bits', label: 'Bit Width', type: 'number', min: 2, max: 16, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'digital-ic', icon: 'CTR', accentColor: '#10b981', polarity: 'none' }, preview: { family: 'dip-16', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Sequential logic block that increments state each clock.', commonUses: ['Frequency division'], commonMistakes: ['Missing reset behavior'], relatedLessonTags: ['sequential-logic'] }, tutorVocabulary: ['counter'], searchTags: ['digital'] },
  { type: 'shift-register', displayName: 'Shift Register Placeholder', shortName: 'SR', category: 'Digital Logic', subcategory: 'Sequential', aliases: ['serial in parallel out'], description: 'Shifts bits through staged storage.', simulationSupport: 'reference', terminals: [{ id: 'clk', label: 'CLK', offset: 0 }, { id: 'data', label: 'D', offset: 1 }, { id: 'q', label: 'Q', offset: 2 }], defaultProperties: { stages: 8 }, editableProperties: [{ key: 'stages', label: 'Stages', type: 'number', min: 4, max: 16, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'digital-ic', icon: 'SR', accentColor: '#10b981', polarity: 'none' }, preview: { family: 'dip-16', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Moves data one stage per clock edge.', commonUses: ['Output expansion'], commonMistakes: ['Clock/data timing confusion'], relatedLessonTags: ['sequential-logic'] }, tutorVocabulary: ['shift register'], searchTags: ['digital'] },
  { type: 'voltage-regulator', displayName: 'Voltage Regulator', shortName: 'REG', category: 'Utility / Protection', subcategory: 'Power Conditioning', aliases: ['linear regulator'], description: 'Regulates input to stable output voltage.', simulationSupport: 'partial', terminals: [{ id: 'in', label: 'IN', offset: 0 }, { id: 'gnd', label: 'GND', offset: 1 }, { id: 'out', label: 'OUT', offset: 2 }], defaultProperties: { outputVoltage: 5 }, editableProperties: [{ key: 'outputVoltage', label: 'Output Voltage (V)', type: 'number', min: 1.8, max: 12, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'to220', icon: 'REG', accentColor: '#38bdf8', polarity: 'none' }, preview: { family: 'to220-regulator', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Maintains a target output voltage despite input/load changes.', commonUses: ['5V rails'], commonMistakes: ['Ignoring dropout'], relatedLessonTags: ['power-conditioning'] }, tutorVocabulary: ['regulator'], searchTags: ['7805'] },
  { type: 'fuse', displayName: 'Fuse', shortName: 'F', category: 'Utility / Protection', subcategory: 'Protection', aliases: ['safety fuse'], description: 'Over-current protection element.', simulationSupport: 'reference', terminals: baseTwoTerminal(), defaultProperties: { currentRatingA: 1 }, editableProperties: [{ key: 'currentRatingA', label: 'Current Rating (A)', type: 'number', min: 0.1, max: 10, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'axial-device', icon: 'F', accentColor: '#f87171', polarity: 'none' }, preview: { family: 'axial-diode', preferredKind: '3d' }, learning: { level: 'beginner', plainExplanation: 'Sacrificial element that opens during over-current.', commonUses: ['Input protection'], commonMistakes: ['Oversized fuse'], relatedLessonTags: ['safety'] }, tutorVocabulary: ['fuse'], searchTags: ['protection'] },
  { type: 'buzzer', displayName: 'Buzzer', shortName: 'BZ', category: 'Output Devices', subcategory: 'Audio', aliases: ['piezo buzzer'], description: 'Simple beeping audio output.', simulationSupport: 'partial', terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }], defaultProperties: { frequencyHz: 2000 }, editableProperties: [{ key: 'frequencyHz', label: 'Tone (Hz)', type: 'number', min: 100, max: 8000, step: 10 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'output-round', icon: '♪', accentColor: '#e879f9', polarity: 'polarized' }, preview: { family: 'audio', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Converts electrical signal into beeps.', commonUses: ['Alerts'], commonMistakes: ['Driving directly from weak IO pin'], relatedLessonTags: ['outputs'] }, tutorVocabulary: ['buzzer'], searchTags: ['audio'] },
  { type: 'speaker', displayName: 'Speaker', shortName: 'SPK', category: 'Output Devices', subcategory: 'Audio', aliases: ['dynamic speaker'], description: 'Audio output transducer.', simulationSupport: 'reference', terminals: baseTwoTerminal(), defaultProperties: { impedanceOhms: 8 }, editableProperties: [{ key: 'impedanceOhms', label: 'Impedance (Ω)', type: 'number', min: 4, max: 32, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'output-round', icon: '🔊', accentColor: '#c084fc', polarity: 'none' }, preview: { family: 'audio', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Converts electrical waveform to sound.', commonUses: ['Tone playback'], commonMistakes: ['No amplifier stage'], relatedLessonTags: ['outputs'] }, tutorVocabulary: ['speaker'], searchTags: ['audio'] },
  { type: 'lamp', displayName: 'Lamp / Bulb', shortName: 'LAMP', category: 'Output Devices', subcategory: 'Lighting', aliases: ['bulb'], description: 'Incandescent-style light load.', simulationSupport: 'reference', terminals: baseTwoTerminal(), defaultProperties: { ratedVoltage: 6 }, editableProperties: [{ key: 'ratedVoltage', label: 'Rated Voltage (V)', type: 'number', min: 1.5, max: 24, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'output-round', icon: '💡', accentColor: '#facc15', polarity: 'none' }, preview: { family: 'output', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Resistive light-producing output element.', commonUses: ['Load demonstration'], commonMistakes: ['No current limiting'], relatedLessonTags: ['outputs'] }, tutorVocabulary: ['lamp'], searchTags: ['bulb'] },
  { type: 'relay', displayName: 'Relay', shortName: 'RY', category: 'Output Devices', subcategory: 'Electromechanical', aliases: ['electromechanical switch'], description: 'Coil-driven isolated switch.', simulationSupport: 'partial', terminals: [{ id: 'coil+', label: 'C+', offset: 0 }, { id: 'coil-', label: 'C-', offset: 1 }, { id: 'no', label: 'NO', offset: 2 }], defaultProperties: { coilVoltage: 5 }, editableProperties: [{ key: 'coilVoltage', label: 'Coil Voltage (V)', type: 'number', min: 3, max: 24, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'relay', icon: 'RY', accentColor: '#22d3ee', polarity: 'none' }, preview: { family: 'relay', preferredKind: '3d' }, learning: { level: 'intermediate', plainExplanation: 'Uses an electromagnet to actuate switch contacts.', commonUses: ['Driving higher voltage loads'], commonMistakes: ['Missing flyback diode'], relatedLessonTags: ['actuators'] }, tutorVocabulary: ['relay'], searchTags: ['coil'] },
  { type: 'motor', displayName: 'Motor', shortName: 'M', category: 'Output Devices', subcategory: 'Actuators', aliases: ['dc motor'], description: 'Electromechanical rotary actuator.', simulationSupport: 'reference', terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }], defaultProperties: { ratedVoltage: 6 }, editableProperties: [{ key: 'ratedVoltage', label: 'Rated Voltage (V)', type: 'number', min: 1.5, max: 24, step: 0.1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'motor', icon: 'M', accentColor: '#22c55e', polarity: 'polarized' }, preview: { family: 'motor', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Converts electrical power to rotational motion.', commonUses: ['Robotics'], commonMistakes: ['Driving from IO pin directly'], relatedLessonTags: ['actuators'] }, tutorVocabulary: ['motor'], searchTags: ['actuator'] },
  { type: 'microphone', displayName: 'Microphone', shortName: 'MIC', category: 'Sensors', subcategory: 'Audio', aliases: ['mic'], description: 'Converts sound pressure to electrical signal.', simulationSupport: 'reference', terminals: [{ id: 'positive', label: '+', offset: 0 }, { id: 'negative', label: '-', offset: 1 }], defaultProperties: { sensitivityMvPa: 10 }, editableProperties: [{ key: 'sensitivityMvPa', label: 'Sensitivity (mV/Pa)', type: 'number', min: 1, max: 50, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'sensor', icon: '🎤', accentColor: '#a855f7', polarity: 'polarized' }, preview: { family: 'sensor', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Senses sound and outputs small varying voltage.', commonUses: ['Audio detection'], commonMistakes: ['Missing bias circuit'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['microphone'], searchTags: ['audio sensor'] },
  { type: 'hall-sensor', displayName: 'Hall Sensor', shortName: 'HALL', category: 'Sensors', subcategory: 'Magnetic', aliases: ['hall effect'], description: 'Magnetic field sensing component.', simulationSupport: 'reference', terminals: [{ id: 'vcc', label: 'V', offset: 0 }, { id: 'gnd', label: 'G', offset: 1 }, { id: 'out', label: 'O', offset: 2 }], defaultProperties: { thresholdMt: 5 }, editableProperties: [{ key: 'thresholdMt', label: 'Threshold (mT)', type: 'number', min: 1, max: 100, step: 1 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'sensor', icon: '🧲', accentColor: '#06b6d4', polarity: 'none' }, preview: { family: 'sensor', preferredKind: '2d' }, learning: { level: 'intermediate', plainExplanation: 'Detects magnetic fields and outputs a signal.', commonUses: ['Speed sensing'], commonMistakes: ['Wrong magnetic orientation'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['hall sensor'], searchTags: ['magnetic'] },
  { type: 'reed-switch', displayName: 'Reed Switch', shortName: 'REED', category: 'Sensors', subcategory: 'Magnetic', aliases: ['magnetic switch'], description: 'Magnetically actuated switch.', simulationSupport: 'reference', terminals: baseTwoTerminal(), defaultProperties: { isClosed: false }, editableProperties: [{ key: 'isClosed', label: 'Closed', type: 'boolean' }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 1 }, visual2D: { family: 'switch', icon: '⟂', accentColor: '#22d3ee', polarity: 'none' }, preview: { family: 'switch', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Switch that closes in presence of magnetic field.', commonUses: ['Door sensors'], commonMistakes: ['Using beyond current rating'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['reed switch'], searchTags: ['magnetic switch'] },
  { type: 'light-sensor-module', displayName: 'Light Sensor Module', shortName: 'LUX', category: 'Sensors', subcategory: 'Light', aliases: ['light sensor'], description: 'General light sensing module family entry.', simulationSupport: 'reference', terminals: [{ id: 'vcc', label: 'V', offset: 0 }, { id: 'gnd', label: 'G', offset: 1 }, { id: 'out', label: 'O', offset: 2 }], defaultProperties: { threshold: 0.5 }, editableProperties: [{ key: 'threshold', label: 'Threshold', type: 'number', min: 0, max: 1, step: 0.01 }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'sensor', icon: '☼', accentColor: '#fbbf24', polarity: 'none' }, preview: { family: 'sensor', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Module that translates light intensity into electrical output.', commonUses: ['Ambient sensing'], commonMistakes: ['No calibration'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['light sensor module'], searchTags: ['ldr module'] },
  { type: 'temperature-sensor', displayName: 'Temperature Sensor Placeholder', shortName: 'TEMP', category: 'Sensors', subcategory: 'Temperature', aliases: ['temp sensor'], description: 'General temperature sensing family entry.', simulationSupport: 'reference', terminals: [{ id: 'vcc', label: 'V', offset: 0 }, { id: 'gnd', label: 'G', offset: 1 }, { id: 'out', label: 'O', offset: 2 }], defaultProperties: { units: 'celsius' }, editableProperties: [{ key: 'units', label: 'Units', type: 'select', options: [{ label: 'Celsius', value: 'celsius' }, { label: 'Fahrenheit', value: 'fahrenheit' }] }], placementRules: { canPlaceOnBoard: true, preferredTerminalSpan: 2 }, visual2D: { family: 'sensor', icon: '🌡', accentColor: '#fb923c', polarity: 'none' }, preview: { family: 'sensor', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Represents temperature sensors used in control systems.', commonUses: ['Thermostats'], commonMistakes: ['Wrong sensor type assumptions'], relatedLessonTags: ['sensors'] }, tutorVocabulary: ['temperature sensor'], searchTags: ['thermal'] },
  { type: 'jumper-wire', displayName: 'Jumper Wire', shortName: 'JMP', category: 'Breadboard Helpers', subcategory: 'Connections', aliases: ['wire'], description: 'Direct low-ohm connection wire.', simulationSupport: 'full', terminals: baseTwoTerminal(), defaultProperties: { color: 'cyan' }, editableProperties: [{ key: 'color', label: 'Color', type: 'select', options: [{ label: 'Cyan', value: 'cyan' }, { label: 'Violet', value: 'violet' }, { label: 'Amber', value: 'amber' }] }], placementRules: { canPlaceOnBoard: false, preferredTerminalSpan: 1 }, visual2D: { family: 'wire', icon: '∿', accentColor: '#22d3ee', polarity: 'none' }, preview: { family: 'wire', preferredKind: '2d' }, learning: { level: 'beginner', plainExplanation: 'Connects two breadboard points to complete a net.', commonUses: ['Routing'], commonMistakes: ['Visual clutter and wire crossing'], relatedLessonTags: ['breadboard-basics'] }, tutorVocabulary: ['jumper wire'], searchTags: ['connection'] }
];

export interface ComponentPaletteItem {
  type: ComponentType;
  title: string;
  description: string;
  category: ComponentCategory;
  icon: string;
}

export const COMPONENT_PALETTE: ComponentPaletteItem[] = COMPONENT_DEFINITIONS.map((definition) => ({
  type: definition.type,
  title: definition.displayName,
  description: definition.description,
  category: definition.category,
  icon: definition.visual2D.icon,
}));
