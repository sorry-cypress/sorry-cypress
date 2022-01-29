// organize-imports-ignore
import 'source-map-support/register';


import { initMongoNoIndexes } from '@sorry-cypress/mongo';
import { ApolloServer } from 'apollo-server';
import { HOST, PORT } from './config';
import { InstancesAPI } from './datasources/instances';
import { ProjectsAPI } from './datasources/projects';
import { RunsAPI } from './datasources/runs';
import { RunTimeoutAPI } from './datasources/runTimeout';
import { SpecsAPI } from './datasources/specs';
import { resolvers } from './resolvers';
import { typeDefs } from './schema/schema';

async function start() {
  await initMongoNoIndexes();
  const dataSources = {
    runsAPI: new RunsAPI(),
    instancesAPI: new InstancesAPI(),
    projectsAPI: new ProjectsAPI(),
    specsAPI: new SpecsAPI(),
    runTimeoutAPI: new RunTimeoutAPI(),
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => dataSources,
    onHealthCheck: async () => 'true',
    playground: true,
    introspection: true,
  });

  server
    .listen({ host: HOST, port: PORT })
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
