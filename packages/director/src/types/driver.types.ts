import {
  Instance,
  InstanceResult,
  ScreenshotUploadInstruction,
  AssetUploadInstruction,
  Project,
  CreateRunParameters,
  CreateRunResponse,
  Run,
  RunWithSpecs,
  Task,
} from '@sorry-cypress/common';

interface Driver {
  id: string;
  init: () => Promise<void>;
}
export interface ScreenshotsDriver extends Driver {
  getVideoUploadUrl: (
    instanceId: string,
    result: InstanceResult
  ) => Promise<AssetUploadInstruction | null>;

  getScreenshotsUploadUrls: (
    instanceId: string,
    result: InstanceResult
  ) => Promise<ScreenshotUploadInstruction[]>;
}

interface GetNextTaskParams {
  runId: string;
  machineId: string;
  groupId: string;
}

interface SetRunInactivityTimeoutParams {
  runId: string;
  timeoutMs: number;
}
export interface ExecutionDriver extends Driver {
  getRunWithSpecs: (runId: string) => Promise<RunWithSpecs>;
  getProjectById: (projectId: string) => Promise<Project>;
  getRunById: (runId: string) => Promise<Run>;
  getInstanceById: (instanceId: string) => Promise<Instance>;
  createRun: (params: CreateRunParameters) => Promise<CreateRunResponse>;
  getNextTask: (params: GetNextTaskParams) => Promise<Task>;
  setRunInactivityTimeout: (
    params: SetRunInactivityTimeoutParams
  ) => Promise<void>;
  setInstanceResults: (
    instanceId: string,
    results: InstanceResult
  ) => Promise<void>;
  setScreenshotUrl: (
    instanceId: string,
    screenshotId: string,
    screenshotUrl: string
  ) => Promise<void>;
  setVideoUrl: (params: {
    instanceId: string;
    videoUrl: string;
  }) => Promise<void>;
}
