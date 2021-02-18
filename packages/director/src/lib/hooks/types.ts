export interface HookEventPayload {
  runId: string;
}

export interface RunSummaryForHooks {
  failures: number;
  passes: number;
  skipped: number;
  tests: number;
  pending: number;
  wallClockStartedAt: Date;
  wallClockDuration: number;
}
