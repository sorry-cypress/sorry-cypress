export interface Instance {
  instanceId: string;
  runId: string;
  results?: InstanceResult;
}

export interface Screenshot {
  screenshotId: string;
  name: string | null;
  testId: string;
  takenAt: string;
  height: number;
  width: number;
  screenshotURL?: string;
}

export interface InstanceResultStats {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  skipped: number;
  failures: number;
  wallClockStartedAt: Date;
  wallClockEndedAt: Date;
  wallClockDuration: number;
}

export interface CypressConfig {
  video: boolean;
  videoUploadOnPasses: boolean;
  [key: string]: any;
}

export interface InstanceResult {
  stats: InstanceResultStats;
  tests: object[];
  error: null | string;
  reporterStats: object;
  cypressConfig: CypressConfig;
  screenshots: Screenshot[];
  video: boolean;
  videoUrl?: string;
}

export interface AssetUploadInstruction {
  uploadUrl: string;
  readUrl: string;
}

export interface ScreenshotUploadInstruction extends AssetUploadInstruction {
  screenshotId: string;
}
