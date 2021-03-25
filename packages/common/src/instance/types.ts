import { Test, TestV670 } from '../tests';

export interface Instance {
  instanceId: string;
  runId: string;
  // 6.7.0+ reports tests before running specs
  _createTestsPayload: SetInstanceTestsPayload;
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
  wallClockStartedAt: string;
  wallClockEndedAt: string;
  wallClockDuration: number;
}

interface ReporterStats {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  failures: number;
  start: string;
  end: string;
  duration: number;
}

export interface CypressConfig {
  video: boolean;
  videoUploadOnPasses: boolean;
  [key: string]: any;
}

export interface InstanceResult {
  stats: InstanceResultStats;
  tests: Test[];
  error?: string;
  reporterStats: ReporterStats;
  exception: null | string;
  cypressConfig?: CypressConfig;
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
