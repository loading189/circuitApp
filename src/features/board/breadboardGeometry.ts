import type { BreadboardGeometry, BreadboardHole, StripColumn } from './boardTypes';

const ROWS = 30;
const HOLE_STEP_X = 28;
const HOLE_STEP_Y = 20;
const BOARD_PADDING_X = 64;
const BOARD_PADDING_Y = 52;
const TRENCH_GAP = 42;
const RAIL_GAP = 22;

const LEFT_COLUMNS: StripColumn[] = ['a', 'b', 'c', 'd', 'e'];
const RIGHT_COLUMNS: StripColumn[] = ['f', 'g', 'h', 'i', 'j'];

const holeId = (zone: string, index: number) => `${zone}-${index}`;

const stripHoleId = (side: 'left' | 'right', column: StripColumn, row: number) => `${side}-${column}-${row}`;

const buildRail = (
  zone: BreadboardHole['zone'],
  y: number,
  netGroup: string,
): BreadboardHole[] => {
  return Array.from({ length: ROWS }, (_, i) => {
    const row = i + 1;
    return {
      id: holeId(zone, row),
      zone,
      row,
      column: null,
      x: BOARD_PADDING_X + i * HOLE_STEP_X,
      y,
      defaultNetGroup: `${netGroup}-${row <= 15 ? 'left' : 'right'}`,
    };
  });
};

const buildStripRows = (
  side: 'left' | 'right',
  columns: StripColumn[],
  yOffset: number,
): BreadboardHole[] => {
  return Array.from({ length: ROWS }, (_, rowIndex) => {
    const row = rowIndex + 1;
    return columns.map((column, columnIndex) => {
      const x = BOARD_PADDING_X + rowIndex * HOLE_STEP_X;
      const y = yOffset + columnIndex * HOLE_STEP_Y;
      return {
        id: stripHoleId(side, column, row),
        zone: side === 'left' ? 'left-strip' : 'right-strip',
        row,
        column,
        x,
        y,
        defaultNetGroup: `${side}-strip-row-${row}`,
      };
    });
  }).flat();
};

export const createDefaultBreadboardGeometry = (): BreadboardGeometry => {
  const railTopPositiveY = BOARD_PADDING_Y;
  const railTopNegativeY = railTopPositiveY + RAIL_GAP;
  const leftStripTopY = railTopNegativeY + 52;
  const rightStripTopY = leftStripTopY + 5 * HOLE_STEP_Y + TRENCH_GAP;
  const railBottomPositiveY = rightStripTopY + 5 * HOLE_STEP_Y + 52;
  const railBottomNegativeY = railBottomPositiveY + RAIL_GAP;

  const holes = [
    ...buildRail('rail-top-positive', railTopPositiveY, 'rail-top-positive'),
    ...buildRail('rail-top-negative', railTopNegativeY, 'rail-top-negative'),
    ...buildStripRows('left', LEFT_COLUMNS, leftStripTopY),
    ...buildStripRows('right', RIGHT_COLUMNS, rightStripTopY),
    ...buildRail('rail-bottom-positive', railBottomPositiveY, 'rail-bottom-positive'),
    ...buildRail('rail-bottom-negative', railBottomNegativeY, 'rail-bottom-negative'),
  ];

  const holesById = Object.fromEntries(holes.map((hole) => [hole.id, hole]));
  const stripsByDefaultNet = holes.reduce<Record<string, string[]>>((acc, hole) => {
    acc[hole.defaultNetGroup] ??= [];
    acc[hole.defaultNetGroup].push(hole.id);
    return acc;
  }, {});

  return {
    width: BOARD_PADDING_X * 2 + ROWS * HOLE_STEP_X,
    height: railBottomNegativeY + 60,
    holeRadius: 4,
    holes,
    holesById,
    stripsByDefaultNet,
  };
};
