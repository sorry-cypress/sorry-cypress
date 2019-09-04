export const resolvers = {
  Query: {
    runs: (_, __, { dataSources }) => dataSources.runsAPI.getAllRuns(),
    run: (_, { id }: { id: string }, { dataSources }) =>
      dataSources.runsAPI.getRunById(id),
    instance: (_, { id }: { id: string }, { dataSources }) =>
      dataSources.instancesAPI.getInstanceById(id)
  }
};
