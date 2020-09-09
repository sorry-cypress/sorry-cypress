import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/schema';
import { RunsAPI } from './datasources/runs';
import { InstancesAPI } from './datasources/instances';
import { ProjectsAPI } from './datasources/projects';
import { resolvers } from './resolvers';

import { PORT } from './config';

const dataSources = {
  runsAPI: new RunsAPI(),
  instancesAPI: new InstancesAPI(),
  projectsAPI: new ProjectsAPI(),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => dataSources,
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Apollo server ready at ${url}`);
});
