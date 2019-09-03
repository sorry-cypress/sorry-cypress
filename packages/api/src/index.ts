import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';

import { RunsAPI } from './datasources/runs';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    runsAPI: new RunsAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Apollo server ready at ${url}`);
});
