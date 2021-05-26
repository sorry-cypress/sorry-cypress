import {
  AssetUploadInstruction,
  CreateRunParameters,
  CreateRunResponse,
  Instance,
  InstanceResult,
  Project,
  Run,
  RunWithSpecs,
  ScreenshotUploadInstruction,
  SetInstanceTestsPayload,
  Task,
  UpdateInstanceResultsPayload,
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
  cypressVersion: string;
}

interface SetRunCompletedWithTimeout {
  runId: string;
  timeoutMs: number;
}

export interface ExecutionDriver extends Driver {
  maybeSetRunCompleted: (runId: string) => Promise<boolean>;
  allGroupSpecsCompleted: (runId: string, groupId: string) => Promise<boolean>;
  getRunWithSpecs: (runId: string) => Promise<RunWithSpecs>;
  getProjectById: (projectId: string) => Promise<Project>;
  getRunById: (runId: string) => Promise<Run>;
  getInstanceById: (instanceId: string) => Promise<Instance>;
  createRun: (params: CreateRunParameters) => Promise<CreateRunResponse>;
  getNextTask: (params: GetNextTaskParams) => Promise<Task>;
  setRunCompleted: (runId: string) => Promise<void>;
  setRunCompletedWithTimeout: (
    params: SetRunCompletedWithTimeout
  ) => Promise<void>;
  setInstanceResults: (
    instanceId: string,
    results: InstanceResult
  ) => Promise<void>;
  setInstanceTests: (
    instanceId: string,
    payload: SetInstanceTestsPayload
  ) => Promise<void>;
  updateInstanceResults: (
    instanceId: string,
    payload: UpdateInstanceResultsPayload
  ) => Promise<Instance>;
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
