
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

import { InstancesAPI } from './datasources/instances';
import { ProjectsAPI } from './datasources/projects';
import { RunsAPI } from './datasources/runs';
import { RunTimeoutAPI } from './datasources/runTimeout';
import { SpecsAPI } from './datasources/specs';
import { resolvers } from './resolvers';
import { typeDefs } from './schema/schema';
import { catchRequestHandlerErrors } from './lib/express';



export const start = async function start(host: string, port: number, basePath: string, apolloPlayground: string) {
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
      apolloPlayground === 'false'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });


  const app = express();

  app.disable('x-powered-by');

  app.get(
    '/health-check-db',
    catchRequestHandlerErrors(async (_, res) => {
      (await isMongoDBHealthy()) ? res.sendStatus(200) : res.sendStatus(503);
    })
  );

  const httpServer = stoppable(http.createServer(app), 10_000);

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: basePath,
    bodyParserConfig: { limit: '50mb' },
    onHealthCheck: async () => Promise.resolve('true'),
    cors: { origin: '*' },
  });

  await new Promise((resolve, reject) => {
    httpServer.once('listening', resolve);
    httpServer.once('error', reject);
    httpServer.listen({ port: port, host: host });
  });

  const url = format({
    protocol: 'http',
    hostname: (httpServer.address() as any).address,
    port: (httpServer.address() as any).port,
    pathname: basePath,
  });

  console.log(`🚀 Apollo server is ready at ${url}`);
  return { httpServer, apolloServer };
}
