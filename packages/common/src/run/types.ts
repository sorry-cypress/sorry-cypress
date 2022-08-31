import { InstanceResultStats } from '../instance/types';

export interface CommitData {
  sha: string;
  branch?: string;
  authorName?: string;
  authorEmail?: string;
  message?: string;
  remoteOrigin?: string;
}
export interface PlatformData {
  osName: string;
  osVersion: string;
}

// https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/util/ci_provider.js#L133:L133
export interface RunCIParams {
  [key: string]: any;
  ciBuildId?: string;
}
export interface RunCI {
  params: RunCIParams | null;
  provider: string | null; // that should be named
}
export interface CreateRunParameters {
  ciBuildId: string;
  commit: CommitData;
  projectId: string;
  specs: string[];
  ci: RunCI;
  platform: PlatformData;
  group?: string;
  cypressVersion?: string;
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
  ci: RunCI;
}
export interface RunSpec {
  spec: string;
  groupId: string;
  instanceId: string;
  claimedAt: string | null;
  completedAt: string | null;
  machineId?: string;
  results?: {
    error?: string;
    stats: InstanceResultStats;
  };
}

export type RunCompletion =
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
  cypressVersion?: string;
  progress: RunProgress;
}

export interface Build {
  runs: Run[];
}

export interface RunProgress {
  updatedAt: Date | null;
  groups: RunGroupProgress[];
}

export interface RunGroupProgress {
  groupId: string;
  instances: {
    overall: number;
    claimed: number;
    complete: number;
    passes: number;
    failures: number;
  };
  tests: {
    overall: number;
    passes: number;
    failures: number;
    skipped: number;
    pending: number;
    flaky: number;
  };
}

export interface Task {
  instance: RunSpec | null;
  claimedInstances: number;
  totalInstances: number;
  projectId: string;
}

export interface RunSummary {
  failures: number;
  passes: number;
  skipped: number;
  tests: number;
  pending: number;
  wallClockDurationSeconds: number;
}
