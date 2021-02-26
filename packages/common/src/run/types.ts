import { Instance } from '../instance/types';

export interface CommitData {
  sha: string;
}
export interface PlatformData {
  osName: string;
  osVersion: string;
}
export interface CreateRunParameters {
  ciBuildId: string;
  commit: CommitData;
  projectId: string;
  specs: string[];
  platform: PlatformData;
  group?: string;
}

export type CreateRunWarning = Record<string, string> & {
  message: string;
};
export interface CreateRunResponse {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  warnings?: CreateRunWarning[];
  isNewRun: boolean;
}

export interface RunMetaData {
  ciBuildId: string;
  commit: CommitData;
  projectId: string;
  platform: PlatformData;
}
export interface RunSpec {
  spec: string;
  instanceId: string;
  claimed: boolean;
  groupId?: string;
  machineId?: string;
}

type RunCompletion =
  | { completed: false }
  | {
      completed: true;
      inactivityTimeoutMs?: number;
    };

export interface Run {
  runId: string;
  createdAt: string;
  meta: RunMetaData;
  specs: RunSpec[];
  completion?: RunCompletion;
}

export interface Task {
  instance: RunSpec | null;
  claimedInstances: number;
  totalInstances: number;
}

export type RunWithSpecs = Run & {
  specsFull: Instance[];
};

export interface RunSummary {
  failures: number;
  passes: number;
  skipped: number;
  tests: number;
  pending: number;
  // wallClockStartedAt: Date;
  wallClockDurationSeconds: number;
}
