export interface Instance {
  instanceId: string;
  results: InstanceResult;
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

export interface InstanceResult {
  stats: InstanceResultStats;
  tests: object[];
  error: null | string;
  reporterStats: object;
  cypressConfig: object;
  screenshots: Screenshot[];
}

export interface ScreenshotUploadInstruction {
  screenshotId: string;
  uploadUrl: string;
  readUrl: string;
}
