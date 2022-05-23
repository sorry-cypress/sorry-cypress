import { ObjectId } from 'mongodb';
import { Hook } from '../hook';

export interface Project {
  projectId: string;
  createdAt: string;
  hooks?: Hook[] | null;
  inactivityTimeoutSeconds?: number;
  projectColor?: string | null;
}

export interface ProjectWithId extends Project {
  _id: ObjectId;
}
