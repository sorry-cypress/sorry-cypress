import { AppDatasources } from '@src/datasources/types';
import { GraphQLDateTime } from 'graphql-iso-date';

type Project = {
  projectId: string,
}

export const resolvers = {
  DateTime: GraphQLDateTime,
  InstanceTestUnion: {
    __resolveType(obj) {
      if (obj.attempts) {
        return 'InstanceTestV5';
      }
      if (obj.wallClockStartedAt) {
        return 'InstanceTest';
      }
      return null;
    },
  },
  Query: {
    projects: (
      _,
      { orderDirection, filters },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return dataSources.projectsAPI.getProjects({ orderDirection, filters });
    },
    project: (
      _,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.getProjectById(id),
    runs: (
      _,
      { orderDirection, filters },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return dataSources.runsAPI.getAllRuns({ orderDirection, filters });
    },
    runFeed: (
      _,
      { cursor, filters },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunFeed({ cursor: cursor || false, filters }),
    run: (
      _,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunById(id),
    instance: (
      _,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.instancesAPI.getInstanceById(id),
  },
  Mutation: {
    deleteRun: async (
      _,
      { runId }: { runId: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return resolvers.Mutation.deleteRuns(_ ,{runIds:[runId]} ,{dataSources})
    },
    deleteRuns: async (
      _,
      { runIds }: { runIds: string[] },
      { dataSources }
    ) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesByRunIds(
        runIds
      );
      if (instancesDeleteResponse.success) {
        return dataSources.runsAPI.deleteRunsByIds(runIds);
      } else {
        return instancesDeleteResponse;
      }
    },
    deleteRunsInDateRange: async (
      _,
      { startDate, endDate }: { startDate: Date; endDate: Date },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const instancesDeleteResponse = await dataSources.instancesAPI.deleteInstancesInDateRange(
        startDate,
        endDate
      );
      if (instancesDeleteResponse.success === true) {
        return dataSources.runsAPI.deleteRunsInDateRange(startDate, endDate);
      } else {
        return instancesDeleteResponse;
      }
    },
    createProject: (
      _,
      { project },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.createProject(project),
    updateProject: (
      _,
      { project },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.updateProject(project),
    deleteProject: async (
      _,
      { projectId }: Project,
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const runsMatchingProjectResponse = await dataSources.runsAPI.getAllRuns({
        orderDirection: "DESC",
        filters: [
          {
            key: 'meta.projectId',
            value: projectId,
          },
        ]
      });

      const runsDeleteResponse = await resolvers.Mutation.deleteRuns(
        _,
        {runIds:runsMatchingProjectResponse.map(run => run.runId)},
        {dataSources}
      )
      if (runsDeleteResponse.success) {
        return dataSources.projectsAPI.deleteProjectsByIds([projectId]);
      } else {
        return runsDeleteResponse;
      }

    }
  },
};
