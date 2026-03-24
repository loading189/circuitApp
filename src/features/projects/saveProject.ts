import type { ProjectFile } from './projectTypes';

export const saveProjectBlob = (project: ProjectFile): string => {
  return JSON.stringify(project, null, 2);
};
