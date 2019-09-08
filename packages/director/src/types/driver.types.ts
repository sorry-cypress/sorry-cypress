import { InstanceResult, ScreenshotUploadInstruction } from './instance.types';
import { CreateRunParameters, CreateRunResponse, Task } from './run.types';

interface Driver {
  id: string;
  init: () => Promise<void>;
}
export interface ScreenshotsDriver extends Driver {
  getScreenshotsUploadURLs: (
    instanceId: string,
    result: InstanceResult
  ) => Promise<ScreenshotUploadInstruction[]>;
}

export interface ExecutionDriver extends Driver {
  createRun: (params: CreateRunParameters) => Promise<CreateRunResponse>;
  getNextTask: (runId: string) => Promise<Task>;
  createInstance: (instanceId: string, result: InstanceResult) => Promise<void>;
}
