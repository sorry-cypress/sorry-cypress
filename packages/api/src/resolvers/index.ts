import { ProjectsAPI } from '@src/datasources/projects';
import { RunsAPI } from '@src/datasources/runs';
import { SpecsAPI } from '@src/datasources/specs';
import { AppDatasources } from '@src/datasources/types';
import { Project } from '@src/duplicatedFromDirector/project.types';
import {
  InstanceTestUnion,
  InstanceTestV5,
  OrderingOptions,
} from '@src/generated/graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

function isInstanceV5(
  candidate: InstanceTestUnion
): candidate is InstanceTestV5 {
  return !!(candidate as InstanceTestV5).attempts;
}

export const resolvers = {
  DateTime: GraphQLDateTime,
  TestState: {
    failed: 'failed',
    passed: 'passed',
    pending: 'pending',
    skipped: 'skipped',
  },
  InstanceTestUnion: {
    __resolveType(obj: InstanceTestUnion) {
      if (isInstanceV5(obj)) {
        return 'InstanceTestV5';
      }

      return 'InstanceTest';
    },
  },
  Query: {
    projects: (
      _: any,
      { orderDirection, filters }: Parameters<ProjectsAPI['getProjects']>[0],
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return dataSources.projectsAPI.getProjects({ orderDirection, filters });
    },
    project: (
      _: any,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.getProjectById(id),
    runs: (
      _: any,
      { orderDirection, filters }: Parameters<RunsAPI['getAllRuns']>[0],
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return dataSources.runsAPI.getAllRuns({ orderDirection, filters });
    },
    runFeed: (
      _: any,
      { cursor, filters }: Parameters<RunsAPI['getRunFeed']>[0],
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunFeed({ cursor: cursor || false, filters }),
    run: (
      _: any,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunById(id),
    specStats: (
      _: any,
      args: Parameters<SpecsAPI['getSpecStats']>[0],
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.specsAPI.getSpecStats(args),
    instance: (
      _: any,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.instancesAPI.getInstanceById(id),
  },
  Mutation: {
    deleteRun: async (
      _: any,
      { runId }: { runId: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return resolvers.Mutation.deleteRuns(
        _,
        { runIds: [runId] },
        { dataSources }
      );
    },
    deleteRuns: async (
      _: any,
      { runIds }: { runIds: string[] },
      { dataSources }: { dataSources: AppDatasources }
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
      _: any,
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
      _: any,
      { project }: { project: Project },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.createProject(project),
    updateProject: (
      _: any,
      { project }: { project: Project },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.updateProject(project),
    deleteProject: async (
      _: any,
      { projectId }: Project,
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const runsMatchingProjectResponse = await dataSources.runsAPI.getAllRuns({
        orderDirection: OrderingOptions.Desc,
        filters: [
          {
            key: 'meta.projectId',
            value: projectId,
          },
        ],
      });

      const runsDeleteResponse = await resolvers.Mutation.deleteRuns(
        _,
        { runIds: runsMatchingProjectResponse.map((run) => run.runId) },
        { dataSources }
      );
      if (runsDeleteResponse.success) {
        return dataSources.projectsAPI.deleteProjectsByIds([projectId]);
      } else {
        return runsDeleteResponse;
      }
    },
  },
};
