import { Test, TestV5 } from '@src/tests';
import { differenceInSeconds, parseISO } from 'date-fns';
import { compact, orderBy, sum } from 'lodash';
import { InstanceResult, InstanceResultStats } from '../instance';
import { RunSummary, RunWithSpecs } from './types';

export function getRunDurationSeconds(specs: InstanceResultStats[]): number {
  if (specs.length === 0) {
    return 0;
  }
  if (specs.length === 1) {
    const end = parseISO(specs[0].wallClockEndedAt);
    const start = parseISO(specs[0].wallClockStartedAt);
    return differenceInSeconds(end, start);
  }

  const start = orderBy(specs, 'wallClockStartedAt')[0];
  const end = orderBy(specs, 'wallClockEndedAt', 'desc')[0];

  return differenceInSeconds(
    parseISO(end.wallClockEndedAt),
    parseISO(start.wallClockStartedAt)
  );
}

export function getNumRetries(tests: Test[]) {
  // Only InstanceTestV5 tests have an `attempts` property
  const passes = (tests || [])
    .filter(test => test?.state === 'passed' && 'attempts' in test) as TestV5[];
  // # of retries = # attempts for successful tests - # successful tests
  return sum(passes.map(test => test.attempts.length)) - passes.length;
}

export function getRunSummary(specs: InstanceResult[]): RunSummary {
  return specs.reduce(
    (agg: RunSummary, spec) => {
      const stats = {
        tests: spec.stats?.tests || 0,
        failures: spec.stats?.failures || 0,
        passes: spec.stats?.passes || 0,
        pending: spec.stats?.pending || 0,
        skipped: spec.stats?.skipped || 0,
        retries: getNumRetries(spec.tests),
      }
      return {
        ...agg,
        tests: agg.tests + stats.tests,
        failures: agg.failures + stats.failures,
        passes: agg.passes + stats.passes,
        pending: agg.pending + stats.pending,
        skipped: agg.skipped + stats.skipped,
        retries: agg.retries + stats.retries,
      };
    },
    {
      tests: 0,
      failures: 0,
      passes: 0,
      skipped: 0,
      pending: 0,
      retries: 0,
      wallClockDurationSeconds: getRunDurationSeconds(compact(specs.map(spec => spec.stats))),
    }
  );
}

export function isAllRunSpecsCompleted(run: RunWithSpecs) {
  const allCandidateSpecs = run.specs.map((s) => s.spec);
  const allClaimedSpecs = run.specs.filter((s) => s.claimed);

  if (allCandidateSpecs.length !== allClaimedSpecs.length) {
    return false;
  }

  const claimedInstanceIds = allClaimedSpecs.map((s) => s.instanceId);
  const completedInstanceIds = run.specsFull
    .filter((s) => !!s.results?.stats.wallClockEndedAt)
    .map((s) => s.instanceId);
  return claimedInstanceIds.length === completedInstanceIds.length;
}
