import { Hook } from '../hook';

export interface Project {
  projectId: string;
  createdAt: string;
  hooks?: Hook[] | null;
  inactivityTimeoutMs?: number;
}
