import { GraphQLDateTime } from 'graphql-iso-date';

export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    runs: (
      _,
      { orderDirection, cursor }: { orderDirection: any; cursor?: string },
      { dataSources }
    ) => dataSources.runsAPI.getAllRuns({ orderDirection, cursor }),
    runFeed: (_, { cursor }: { cursor?: string }, { dataSources }) =>
      dataSources.runsAPI.getRunFeed({ cursor: cursor || false }),
    run: (_, { id }: { id: string }, { dataSources }) =>
      dataSources.runsAPI.getRunById(id),
    instance: (_, { id }: { id: string }, { dataSources }) =>
      dataSources.instancesAPI.getInstanceById(id)
  },
  Mutation: {
    deleteRun: async (_, { runId }: { runId: string }, { dataSources }) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesByRunIds([runId]);
      if (instancesDeleteResponse.success) {
        return dataSources.runsAPI.deleteRunsById([runId]);
      } else {
        return instancesDeleteResponse;
      }
    },
    deleteRuns: async (_, { runIds }: { runIds: string[] }, { dataSources }) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesByRunIds(runIds);
      if (instancesDeleteResponse.success) {
        return dataSources.runsAPI.deleteRunsByIds(runIds);
      } else {
        return instancesDeleteResponse;
      }
    },
    deleteRunsInDateRange: async (_, { startDate, endDate }: { startDate: Date, endDate: Date }, { dataSources }) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesInDateRange(startDate, endDate);
      if (instancesDeleteResponse.success === true) {
        return dataSources.runsAPI.deleteRunsInDateRange(startDate, endDate);
      } else {
        return instancesDeleteResponse;
      }
    },
  }
};
