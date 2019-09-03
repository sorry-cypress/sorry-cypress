export const resolvers = {
  Query: {
    runs: (_, __, { dataSources }) => dataSources.runsAPI.getAllRuns(),
    run: (_, { id }: { id: string }, { dataSources }) =>
      dataSources.runsAPI.getRunById(id)
  }
};
