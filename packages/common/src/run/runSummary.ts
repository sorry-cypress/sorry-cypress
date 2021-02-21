import { RunWithSpecs, RunSummary } from './types';

export function getRunSummary(run: RunWithSpecs): RunSummary {
  // TODO: Fix is still running
  const isStillRunning = run.specs.reduce(
    (wasRunning: boolean, currentSpec) => {
      return !currentSpec.claimed || wasRunning;
    },
    false
  );
  const duration = run.specs.reduce(
    (dates: any, currentSpec: any, index: number) => {
      if (currentSpec.results) {
        if (
          index === 0 ||
          new Date(currentSpec?.results?.stats?.wallClockStartedAt) <=
            new Date(dates.firstStart)
        ) {
          dates.firstStart = currentSpec.results.stats.wallClockStartedAt;
        }
        if (
          index === 0 ||
          new Date(currentSpec?.results?.stats?.wallClockEndedAt) >
            new Date(dates.lastEnd)
        ) {
          dates.lastEnd = currentSpec.results.stats.wallClockEndedAt;
        }
      }
      if (index + 1 === run.specs.length) {
        return dates.lastEnd
          ? Number(new Date(dates.lastEnd)) - Number(new Date(dates.firstStart))
          : 0;
      }
      return dates;
    },
    {}
  );
  return run.specs.reduce(
    (agg: any, spec: any) => {
      if (!spec.results) {
        return agg;
      }

      return {
        tests: agg.tests + spec.results.stats.tests,
        failures: agg.failures + spec.results.stats.failures,
        passes: agg.passes + spec.results.stats.passes,
        pending: agg.pending + spec.results.stats.pending,
        skipped: agg.skipped + spec.results.stats.skipped,
        wallClockStartedAt: new Date(run.createdAt),
        wallClockDuration: isStillRunning ? 0 : duration || 0,
      };
    },
    {
      failures: 0,
      passes: 0,
      skipped: 0,
      tests: 0,
      pending: 0,
      wallClockStartedAt: new Date(run.createdAt),
      wallClockDuration: 0,
    }
  );
}
