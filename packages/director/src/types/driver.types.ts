import {
  InstanceResult,
  ScreenshotUploadInstruction,
  AssetUploadInstruction
} from './instance.types';
import { CreateRunParameters, CreateRunResponse, Task } from './run.types';

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

export interface ExecutionDriver extends Driver {
  createRun: (params: CreateRunParameters) => Promise<CreateRunResponse>;
  getNextTask: (runId: string) => Promise<Task>;
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
