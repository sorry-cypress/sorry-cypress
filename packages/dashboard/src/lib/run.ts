import {
  GetRunsFeedDocument,
  GetRunDocument,
  DeleteRunMutation,
  GetInstanceDocument,
  GetRunsFeedQuery,
  GetRunQuery,
} from '../generated/graphql';
import { MutationUpdaterFn } from 'apollo-client';

export const getRunTestsOverall = (run) => {
  const isStillRunning = run.specs.reduce((wasRunning, currentSpec)=>{
    return !currentSpec.claimed || !currentSpec.results || wasRunning
  },false)
  const durration = run.specs.reduce((dates, currentSpec, index)=>{
    if (currentSpec.results) {
      if ( index === 0 || new Date(currentSpec.results?.stats?.wallClockStartedAt) <= new Date(dates.firstStart) ) {
        dates.firstStart = currentSpec.results.stats.wallClockStartedAt
      }
      if (index === 0 || new Date(currentSpec.results?.stats?.wallClockEndedAt) > new Date(dates.lastEnd)) {
        dates.lastEnd = currentSpec.results.stats.wallClockEndedAt
      }
    }
    if (index + 1 === run.specs.length) {
      return dates.lastEnd ? new Date(dates.lastEnd) - new Date(dates.firstStart) : 0
    }
    return dates;
  },{})
  return run.specs.reduce(
    (agg, spec) => {
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
        wallClockDuration: isStillRunning ? 0 : durration || 0
      };
    },
    { failures: 0, passes: 0, skipped: 0, tests: 0, pending: 0, wallClockStartedAt: new Date(run.createdAt), wallClockDuration:0 }
  );
};

export const updateCacheOnDeleteRun: MutationUpdaterFn<DeleteRunMutation> = (
  cache,
  { data, errors }
) => {
  if (!errors && data?.deleteRun.success) {
    try {
      const existingRuns: GetRunsFeedQuery | null = cache.readQuery({
        query: GetRunsFeedDocument,
        variables: {
          cursor: '',
        },
      });
      const filteredRuns = existingRuns?.runFeed.runs.filter(
        (run) => data?.deleteRun.runIds.indexOf(run.runId) === -1
      );
      cache.writeQuery({
        query: GetRunsFeedDocument,
        variables: {
          cursor: '',
        },
        data: {
          runFeed: {
            ...existingRuns?.runFeed,
            runs: filteredRuns,
          },
        },
      });
    } catch (e) {
      // the query does not exist in cache
    }

    data?.deleteRun.runIds.forEach((runId) => {
      try {
        const existingRun: GetRunQuery | null = cache.readQuery({
          query: GetRunDocument,
          variables: {
            runId,
          },
        });

        existingRun?.run?.specs.forEach((spec) => {
          cache.writeQuery({
            query: GetInstanceDocument,
            variables: {
              instanceId: spec?.instanceId,
            },
            data: {
              instance: null,
            },
          });
        });
        cache.writeQuery({
          query: GetRunDocument,
          variables: {
            runId,
          },
          data: {
            run: null,
          },
        });
      } catch (e) {
        // the query does not exist in cache
      }
    });
  }
};
