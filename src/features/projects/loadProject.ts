import type { ProjectFile } from './projectTypes';

export const loadProjectFromText = (raw: string): ProjectFile => {
  const parsed = JSON.parse(raw) as ProjectFile;
  if (parsed.version !== 1) {
    throw new Error('Unsupported project version');
  }
  return parsed;
};
