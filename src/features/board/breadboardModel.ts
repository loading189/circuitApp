import { createDefaultBreadboardGeometry } from './breadboardGeometry';

export const breadboardModel = createDefaultBreadboardGeometry();

export const getStripForHole = (holeId: string): string | null => {
  return breadboardModel.holesById[holeId]?.defaultNetGroup ?? null;
};

export const getStripMembers = (holeId: string): string[] => {
  const strip = getStripForHole(holeId);
  if (!strip) {
    return [];
  }

  return breadboardModel.stripsByDefaultNet[strip] ?? [];
};
