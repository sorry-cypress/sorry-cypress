import { GraphQLDateTime } from 'graphql-iso-date';
import { AppDatasources } from '@src/datasources/types';

export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    runs: (
      _,
      { orderDirection, filters },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return dataSources.runsAPI.getAllRuns({ orderDirection, filters });
    },
    runFeed: (
      _,
      { cursor }: { cursor?: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunFeed({ cursor: cursor || false }),
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
