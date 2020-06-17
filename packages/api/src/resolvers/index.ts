import { GraphQLDateTime } from 'graphql-iso-date';
import { AppDatasources } from '@src/datasources/types';

export const resolvers = {
  DateTime: GraphQLDateTime,
  Build: {
    buildId: (parent) => parent._id,
    meta: (parent) => parent.runs.length &&  parent.runs[0].meta,
  },
  RunFeed: {
    builds: (parent) => parent.runs,
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
      const res = await dataSources.runsAPI.getRunFeed({ cursor: cursor || false, branch: branch || null })
      console.log(JSON.stringify(res, null, 2));
      return res;
    },
    run: (
      _,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunById(id),
    instance: (
      _,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.instancesAPI.getInstanceById(id),
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
