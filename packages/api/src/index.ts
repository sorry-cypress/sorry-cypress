import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/schema';

import { RunsAPI } from './datasources/runs';
import { InstancesAPI } from './datasources/instances';
import { resolvers } from './resolvers';

import { PORT } from './config';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    runsAPI: new RunsAPI(),
    instancesAPI: new InstancesAPI()
  })
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Apollo server ready at ${url}`);
});
