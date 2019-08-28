interface CommitData {
  sha: string;
}
interface PlatformData {
  osName: string;
  osVersion: string;
}
export interface CreateRunParameters {
  ciBuildId: string;
  commit: CommitData;
  projectId: string;
  specs: string[];
  platform: PlatformData;
}

export interface CreateRunResponse {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  warnings?: string[];
}

interface RunMetaData {
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
  meta: RunMetaData;
  specs: RunSpec[];
}
export interface Task {
  instance: RunSpec | null;
  claimedInstances: number;
  totalInstances: number;
}
