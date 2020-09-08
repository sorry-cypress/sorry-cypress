import { GraphQLDateTime } from 'graphql-iso-date';
import { AppDatasources } from '@src/datasources/types';

export const resolvers = {
  DateTime: GraphQLDateTime,
  Run: {
    runId: (parent) => parent._id,
    tests: (parent) => {
      return parent.specs.reduce((acc, spec) => {
        if (!spec.results) return acc;
        return acc + (spec.results.stats.tests || 0);
      }, 0);
    },
    failures: (parent) => {
      return parent.specs.reduce((acc, spec) => {
        if (!spec.results) return acc;
        return acc + (spec.results.stats.failures || 0);
      }, 0);
    },
    passes: (parent) => {
      return parent.specs.reduce((acc, spec) => {
        if (!spec.results) return acc;
        return acc + (spec.results.stats.passes || 0);
      }, 0);
    },
    pending: (parent) => {
      return parent.specs.reduce((acc, spec) => {
        if (!spec.results) return acc;
        return acc + (spec.results.stats.pending || 0);
      }, 0);
    },
    skipped: (parent) => {
      return parent.specs.reduce((acc, spec) => {
        if (!spec.results) return acc;
        return acc + (spec.results.stats.skipped || 0);
      }, 0);
    },
  },
  Query: {
    runs: (
      _,
      { orderDirection }: { orderDirection: any },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getAllRuns({ orderDirection }),
    runFeed: async (
      _,
      { cursor, branch }: { cursor?: string; branch?: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const res = await dataSources.runsAPI.getRunFeed({
        cursor: cursor || false,
        branch: branch || null,
      });
      return res;
    },
    specsRandom: async (
      _,
      { branch }: { branch?: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const res = await dataSources.runsAPI.getSpecsRandom({
        branch: branch || null,
      });
      return res;
    },
    run: async (
      _,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const res = await dataSources.runsAPI.getRunById(id);
      return res;
    },
    instance: (
      _,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.instancesAPI.getInstanceById(id),

    branches: (_, args, { dataSources }: { dataSources: AppDatasources }) =>
      dataSources.runsAPI.getBranches(),
  },
  Mutation: {
    deleteRun: async (
      _,
      { runId }: { runId: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesByRunIds(
        [runId]
      );
      if (instancesDeleteResponse.success) {
        return dataSources.runsAPI.deleteRunsByIds([runId]);
      } else {
        return instancesDeleteResponse;
      }
    },
    deleteRuns: async (
      _,
      { runIds }: { runIds: string[] },
      { dataSources }
    ) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesByRunIds(
        runIds
      );
      if (instancesDeleteResponse.success) {
        return dataSources.runsAPI.deleteRunsByIds(runIds);
      } else {
        return instancesDeleteResponse;
      }
    },
    deleteRunsInDateRange: async (
      _,
      { startDate, endDate }: { startDate: Date; endDate: Date },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesInDateRange(
        startDate,
        endDate
      );
      if (instancesDeleteResponse.success === true) {
        return dataSources.runsAPI.deleteRunsInDateRange(startDate, endDate);
      } else {
        return instancesDeleteResponse;
      }
    },
  },
};
