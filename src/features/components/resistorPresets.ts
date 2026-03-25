export const RESISTOR_PRESET_VALUES = [
  47, 100, 150, 220, 330, 470, 680, 1000, 2200, 4700, 10000, 22000, 47000, 100000, 220000, 470000, 1000000,
] as const;

export const DEFAULT_RESISTOR_OHMS = 1000;

export const formatResistance = (ohms: number): string => {
  if (ohms >= 1_000_000) {
    return `${Math.round((ohms / 1_000_000) * 100) / 100}MΩ`;
  }
  if (ohms >= 1000) {
    return `${Math.round((ohms / 1000) * 100) / 100}kΩ`;
  }
  return `${Math.round(ohms)}Ω`;
};

export const resistorBandCode = (ohms: number): string => {
  const value = Math.max(10, Math.round(ohms));
  const digits = String(value);
  const d1 = Number(digits[0] ?? '1');
  const d2 = Number(digits[1] ?? '0');
  const multiplier = Math.max(0, digits.length - 2);
  const colors = ['Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet', 'Gray', 'White'];
  return `${colors[d1]}-${colors[d2]}-${colors[Math.min(9, multiplier)]}`;
};

export const parseResistanceInput = (raw: string): number | null => {
  const text = raw.trim().toLowerCase().replace(/Ω/g, '');
  if (!text) {
    return null;
  }

  const match = text.match(/^([0-9]*\.?[0-9]+)\s*([kKmM]?)$/);
  if (!match) {
    return null;
  }

  const base = Number(match[1]);
  if (!Number.isFinite(base) || base <= 0) {
    return null;
  }

  const unit = match[2].toLowerCase();
  if (unit === 'k') {
    return Math.round(base * 1000);
  }
  if (unit === 'm') {
    return Math.round(base * 1000000);
  }

  return Math.round(base);
};
