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
  }
};
