import { initMongoNoIndexes, isMongoDBHealthy } from '@sorry-cypress/mongo';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http, { Server } from 'http';
import { isString } from 'lodash';
import stoppable from 'stoppable';
import { InstancesAPI } from './datasources/instances';
import { ProjectsAPI } from './datasources/projects';
import { RunsAPI } from './datasources/runs';
import { RunTimeoutAPI } from './datasources/runTimeout';
import { SpecsAPI } from './datasources/specs';
import { catchRequestHandlerErrors } from './lib/express';
import { resolvers } from './resolvers';
import { typeDefs } from './schema/schema';

export const start = async function start(
  host: string,
  port: number,
  basePath: string,
  apolloPlayground: string
) {
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

  const app = express()
    .disable('x-powered-by')
    .get(
      '/health-check-db',
      catchRequestHandlerErrors(async (_, res) => {
        (await isMongoDBHealthy()) ? res.sendStatus(200) : res.sendStatus(503);
      })
    );

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: basePath,
    bodyParserConfig: { limit: '50mb' },
    onHealthCheck: async () => Promise.resolve('true'),
    cors: { origin: '*' },
  });

  const httpServer = stoppable(http.createServer(app), 10_000) as Server;
  await new Promise((resolve, reject) => {
    httpServer.once('listening', resolve);
    httpServer.once('error', reject);
    httpServer.listen({ port, host });
  });

  console.log(
    `🚀 Apollo server is ready at ${getAddress(httpServer)}${basePath}}`
  );
  return { httpServer, apolloServer };
};

function getAddress(http: Server) {
  const address = http.address();
  if (isString(address)) {
    return address;
  }
  if (address == null) {
    return '';
  }
  const { address: host, port } = address;
  return `http://${host}:${port}`;
}
