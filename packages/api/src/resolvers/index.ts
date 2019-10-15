import { GraphQLDateTime } from 'graphql-iso-date';

export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    runs: (_, { orderDirection }: { orderDirection: any }, { dataSources }) =>
      dataSources.runsAPI.getAllRuns({ orderDirection }),
    run: (_, { id }: { id: string }, { dataSources }) =>
      dataSources.runsAPI.getRunById(id),
    instance: (_, { id }: { id: string }, { dataSources }) =>
      dataSources.instancesAPI.getInstanceById(id)
  }
};
