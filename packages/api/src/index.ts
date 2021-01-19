import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { PORT } from './config';
import { InstancesAPI } from './datasources/instances';
import { ProjectsAPI } from './datasources/projects';
import { RunsAPI } from './datasources/runs';
import { SpecsAPI } from './datasources/specs';
import { resolvers } from './resolvers';
import { typeDefs } from './schema/schema';
import { getExecutionDriver } from "@sorry-cypress/director/src/drivers";
import { app } from "@sorry-cypress/director/src/app";
import { pingDB } from "@src/lib/mongo";

async function start() {
  const dataSources = {
    runsAPI: new RunsAPI(),
    instancesAPI: new InstancesAPI(),
    projectsAPI: new ProjectsAPI(),
    specsAPI: new SpecsAPI(),
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => dataSources,
  });

  const app = express();

  app.get('/health-check-mongo', async (_, res) => {
    await pingDB() ?
      res.sendStatus(200) :
      res.sendStatus(503);
  });

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Apollo server is listening on port ${PORT}`);
  }).on('error', (error) => {
    throw error
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
