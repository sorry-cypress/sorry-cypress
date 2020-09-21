import { ApolloServer } from 'apollo-server';
import { PORT } from './config';
import { InstancesAPI } from './datasources/instances';
import { RunsAPI } from './datasources/runs';
import { resolvers } from './resolvers';
import { typeDefs } from './schema/schema';

async function start() {
  const dataSources = {
    runsAPI: new RunsAPI(),
    instancesAPI: new InstancesAPI(),
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => dataSources,
  });

  server
    .listen({ port: PORT })
    .then(({ url }) => {
      console.log(`🚀 Apollo server is ready at ${url}`);
    })
    .catch((error) => {
      throw error;
    });
}
start().catch((error) => {
  console.error(error);
  process.exit(1);
});
