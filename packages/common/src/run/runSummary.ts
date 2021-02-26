import { differenceInSeconds, parseISO } from 'date-fns';
import { orderBy } from 'lodash';
import { InstanceResultStats } from '../instance';
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

export function getRunSummary(specs: InstanceResultStats[]): RunSummary {
  return specs.reduce(
    (agg: RunSummary, spec) => ({
      ...agg,
      tests: agg.tests + spec.tests,
      failures: agg.failures + spec.failures,
      passes: agg.passes + spec.passes,
      pending: agg.pending + spec.pending,
      skipped: agg.skipped + spec.skipped,
    }),
    {
      failures: 0,
      passes: 0,
      skipped: 0,
      tests: 0,
      pending: 0,
      wallClockDurationSeconds: getRunDurationSeconds(specs),
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
    .filter((s) => !!s.results.stats.wallClockEndedAt)
    .map((s) => s.instanceId);
  return claimedInstanceIds.length === completedInstanceIds.length;
}
