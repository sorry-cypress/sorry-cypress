import { Hook, HookEvent, isGithubHook } from '@sorry-cypress/common';
import { RunWithSpecs } from '@src/types';
import { hookReportSchema } from '@src/lib/schemas';
import { cloneDeep } from 'lodash';
import Ajv from 'ajv';

const ajv = new Ajv({ removeAdditional: 'all' });
const cleanHookReportData = ajv.compile(hookReportSchema);

export interface RunSummaryForHooks {
  failures: number;
  passes: number;
  skipped: number;
  tests: number;
  pending: number;
  wallClockStartedAt: Date;
  wallClockDuration: number;
}

export const getCleanHookReportData = (
  runSummary: RunSummaryForHooks
): RunSummaryForHooks => {
  const cloned = cloneDeep(runSummary);
  // TODO: this fn mutates the data, replace with pure
  cleanHookReportData(cloned);
  return cloned;
};

export function shouldHookHandleEvent(event: HookEvent, hook: Hook) {
  if (isGithubHook(hook)) {
    return true;
  }

  if (!hook.hookEvents || !hook.hookEvents.length) {
    return true;
  }

  if (hook.hookEvents.includes(event)) {
    return true;
  }

  return false;
}

// this is duplicated from dashboard since there is no easy way to share code.
export function getRunTestsOverall(run: RunWithSpecs) {
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
