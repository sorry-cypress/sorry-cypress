import { ObjectId } from 'mongodb';
import { ProjectWithId } from './types';

export function getCreateProjectValue(
  projectId: string,
  inactivityTimeoutSeconds?: number,
  projectColor?: string | null
) {
  return {
    _id: new ObjectId(projectId.trim()),
    projectId: projectId.trim(),
    hooks: [],
    createdAt: new Date().toISOString(),
    inactivityTimeoutSeconds: inactivityTimeoutSeconds ?? 180,
    projectColor: projectColor ?? '',
  } as ProjectWithId;
}
