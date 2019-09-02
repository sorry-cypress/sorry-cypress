import { InstanceResult, ScreenshotUploadInstruction } from './instance.types';

import { CreateRunParameters, CreateRunResponse, Task } from './run.types';

export interface ScreenshotsDriver {
  getScreenshotsUploadURLs: (
    instanceId: string,
    result: InstanceResult
  ) => Promise<ScreenshotUploadInstruction[]>;
}

export interface ExecutionDriver {
  createRun: (params: CreateRunParameters) => Promise<CreateRunResponse>;
  getNextTask: (runId: string) => Promise<Task>;
  createInstance: (instanceId: string, result: InstanceResult) => Promise<void>;
}
