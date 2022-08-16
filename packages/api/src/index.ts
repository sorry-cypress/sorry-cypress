// organize-imports-ignore
import 'source-map-support/register';

import http from 'http';
import { format } from 'url';
import { initMongoNoIndexes, isMongoDBHealthy } from '@sorry-cypress/mongo';
import stoppable from 'stoppable';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import express from 'express';
import { HOST, PORT, APOLLO_PLAYGROUND } from './config';
import { InstancesAPI } from './datasources/instances';
import { ProjectsAPI } from './datasources/projects';
import { RunsAPI } from './datasources/runs';
import { RunTimeoutAPI } from './datasources/runTimeout';
import { SpecsAPI } from './datasources/specs';
import { resolvers } from './resolvers';
import { typeDefs } from './schema/schema';
import { catchRequestHandlerErrors } from './lib/express';

async function start() {
  await initMongoNoIndexes();

  const dataSources = {
    runsAPI: new RunsAPI(),
    instancesAPI: new InstancesAPI(),
    projectsAPI: new ProjectsAPI(),
    specsAPI: new SpecsAPI(),
    runTimeoutAPI: new RunTimeoutAPI(),
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => dataSources,
    introspection: true,
    plugins: [
      APOLLO_PLAYGROUND === 'false'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await apolloServer.start();

  const app = express();

  app.disable('x-powered-by');

  app.get(
    '/health-check-db',
    catchRequestHandlerErrors(async (_, res) => {
      (await isMongoDBHealthy()) ? res.sendStatus(200) : res.sendStatus(503);
    })
  );

  apolloServer.applyMiddleware({
    app,
    path: '/',
    bodyParserConfig: { limit: '50mb' },
    onHealthCheck: async () => Promise.resolve('true'),
    cors: { origin: '*' },
  });

  let httpServer = http.createServer(app);

  httpServer = stoppable(httpServer, 10_000);

  await new Promise((resolve, reject) => {
    httpServer.once('listening', resolve);
    httpServer.once('error', reject);
    httpServer.listen({ port: PORT, host: HOST });
  });

  const url = format({
    protocol: 'http',
    hostname: (httpServer.address() as any).address,
    port: (httpServer.address() as any).port,
    pathname: '/graphql',
  });

  console.log(`🚀 Apollo server is ready at ${url}`);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
