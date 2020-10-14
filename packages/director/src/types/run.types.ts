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

export interface CreateRunResponse {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  warnings?: string[];
}

export interface RunMetaData {
  groupId: string;
  ciBuildId: string;
  commit: CommitData;
  projectId: string;
  platform: PlatformData;
}
export interface RunSpec {
  spec: string;
  instanceId: string;
  claimed: boolean;
}
export interface Run {
  runId: string;
  createdAt: string;
  meta: RunMetaData;
  specs: RunSpec[];
}
export interface Task {
  instance: RunSpec | null;
  claimedInstances: number;
  totalInstances: number;
}
