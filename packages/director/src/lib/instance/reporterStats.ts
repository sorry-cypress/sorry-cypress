import {
  InstanceResultStats,
  ReporterStats,
  Test,
} from '@sorry-cypress/common';

export function getReporterStatsFromTests(tests: Test[]): ReporterStats {
  return {
    suites: 1,
    tests: tests.length,
    passes: tests.filter((t) => t.state === 'passed').length,
    pending: 0,
    failures: tests.filter((t) => t.state === 'failed').length,
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    duration: 0,
  };
}

export function getStatsFromTests(tests: Test[]): InstanceResultStats {
  return {
    suites: 1,
    tests: tests.length,
    skipped: tests.filter((t) => t.state === 'skipped').length,
    passes: tests.filter((t) => t.state === 'passed').length,
    pending: tests.filter((t) => t.state === 'pending').length,
    failures: tests.filter((t) => t.state === 'failed').length,
    wallClockStartedAt: new Date().toISOString(),
    wallClockEndedAt: new Date().toISOString(),
    wallClockDuration: 0,
  };
}
