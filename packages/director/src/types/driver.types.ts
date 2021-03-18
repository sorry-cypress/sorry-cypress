import {
  AssetUploadInstruction,
  CreateRunParameters,
  CreateRunResponse,
  CypressConfig,
  Instance,
  InstanceResult,
  Project,
  Run,
  RunWithSpecs,
  ScreenshotUploadInstruction,
  Task,
  TestV670,
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
  ) => Promise<InstanceResult>;
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

/// Requests payload cypress v6.7.0+
export interface SetInstanceTestsPayload {
  config: CypressConfig;
  tests: Pick<TestV670, 'clientId' | 'body' | 'title' | 'config' | 'hookIds'>[];
  hooks: string[];
}

export type UpdateInstanceResultsPayload = Pick<
  InstanceResult,
  'stats' | 'exception' | 'video' | 'screenshots' | 'reporterStats'
> & {
  tests: Pick<TestV670, 'clientId' | 'state' | 'displayError' | 'attempts'>[];
};
