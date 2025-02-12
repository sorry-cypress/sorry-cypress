import { ProjectsAPI } from '@sorry-cypress/api/datasources/projects';
import { RunsAPI } from '@sorry-cypress/api/datasources/runs';
import { SpecsAPI } from '@sorry-cypress/api/datasources/specs';
import { AppDatasources } from '@sorry-cypress/api/datasources/types';
import {
  CreateBitbucketHookInput,
  CreateGChatHookInput,
  CreateGenericHookInput,
  CreateGithubHookInput,
  CreateProjectInput,
  CreateSlackHookInput,
  CreateTeamsHookInput,
  DeleteHookInput,
  OrderingOptions,
  RunGroupProgressTests,
  RunSpec,
  UpdateBitbucketHookInput,
  UpdateGChatHookInput,
  UpdateGenericHookInput,
  UpdateGithubHookInput,
  UpdateProjectInput,
  UpdateSlackHookInput,
  UpdateTeamsHookInput,
} from '@sorry-cypress/api/generated/graphql';
import { Project } from '@sorry-cypress/common';
import { GraphQLScalarType } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { get, identity } from 'lodash';

const getDatasourceWithInput = <T>(path: string) => (
  _: any,
  { input }: { input: T },
  { dataSources }: { dataSources: AppDatasources }
) => get(dataSources, path)(input);

function getStringLiteral(name: string) {
  return new GraphQLScalarType({
    name,
    parseValue: identity,
    serialize: identity,
    parseLiteral: identity,
  });
}
export const resolvers = {
  DateTime: GraphQLDateTime,
  TestState: {
    failed: 'failed',
    passed: 'passed',
    pending: 'pending',
    skipped: 'skipped',
  },
  GenericHookType: getStringLiteral('GenericHookType'),
  SlackHookType: getStringLiteral('SlackHookType'),
  GithubHookType: getStringLiteral('GithubHookType'),
  BitbucketHookType: getStringLiteral('BitbucketHookType'),
  TeamsHookType: getStringLiteral('TeamsHookType'),
  GChatHookType: getStringLiteral('GChatHookType'),

  RunSpec: {
    results: async (
      parent: RunSpec,
      _: any,
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      if (parent.results) {
        return parent.results;
      }
      const response = await dataSources.instancesAPI.getInstanceById(
        parent.instanceId
      );
      if (!response?.results) {
        return null;
      }
      return {
        ...response.results,
      };
    },
  },
  RunGroupProgressTests: {
    flaky: (parent: RunGroupProgressTests) => parent.flaky ?? 0,
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
      // If there are filters, process each one
      if (filters && filters.length > 0) {
        filters.forEach((filter) => {
          // Specifically check for 'createdAt' field
          if (filter.key === 'createdAt') {
            // Ensure filter.value is not undefined or null
            if (filter.value) {
              // Handle the operator for createdAt (gte, gt, lte, lt)
              switch (filter.operator) {
                case 'gte': // Greater than or equal to
                case 'gt': // Greater than
                case 'lte': // Less than or equal to
                case 'lt': // Less than
                  // Ensure filter.value is a valid date before creating Date object
                  filter.value = new Date(filter.value).toISOString(); // Convert to ISO string if valid
                  break;
                default:
                  // If the operator is not recognized, throw an error or skip processing
                  throw new Error(
                    `Unsupported operator for createdAt: ${filter.operator}`
                  );
              }
            } else {
              throw new Error('Invalid value for createdAt filter');
            }
          }
        });
      }

      // Pass the modified filters to the data source for querying
      return dataSources.runsAPI.getAllRuns({ orderDirection, filters });
    },

    ciBuilds: (
      _: any,
      { filters }: Parameters<RunsAPI['getAllCiBuilds']>[0],
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return dataSources.runsAPI.getAllCiBuilds({ filters });
    },
    runFeed: (
      _: any,
      { cursor, filters }: Parameters<RunsAPI['getRunFeed']>[0],
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunFeed({ cursor: cursor || false, filters }),
    run: async (
      _: any,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.runsAPI.getRunById(id),
    specStats: (
      _: any,
      args: Parameters<SpecsAPI['getSpecStats']>[0],
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.specsAPI.getSpecStats(args),
    instance: async (
      _: any,
      { id }: { id: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      const instance = await dataSources.instancesAPI.getInstanceById(id);
      if (!instance) {
        return null;
      }
      const run = await dataSources.runsAPI.getRunById(instance.runId);
      if (!run) {
        return null;
      }
      return { ...instance, projectId: run.meta.projectId, run };
    },
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
    resetInstance: async (
      _: any,
      { instanceId }: { instanceId: string },
      { dataSources }: { dataSources: AppDatasources }
    ) => {
      return await dataSources.instancesAPI.resetInstanceById(instanceId);
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
        await Promise.all(
          runIds.map((runId) =>
            dataSources.runTimeoutAPI.deleteRunTimeouts(runId)
          )
        );
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
      // Process the deletion in batches
      const batchSize = 20;
      const processedRunIds: string[] = [];
      while (true) {
        const getRunsResponse = await dataSources.runsAPI.getRunsInDateRange(
          startDate,
          endDate,
          batchSize
        );
        if (getRunsResponse.runIds.length == 0) {
          // No more runs in the range, break out of the loop
          break;
        }
        // Delete the runs
        const runsDeleteResponse = await resolvers.Mutation.deleteRuns(
          _,
          { runIds: getRunsResponse.runIds },
          { dataSources }
        );
        if (!runsDeleteResponse.success) {
          return runsDeleteResponse;
        }
        processedRunIds.push(...getRunsResponse.runIds);
      }

      return {
        success: true,
        message: `Deleted ${processedRunIds.length} item(s)`,
        runIds: processedRunIds,
      };
    },
    createProject: (
      _: any,
      { project }: { project: CreateProjectInput },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.createProject(project),
    updateProject: (
      _: any,
      { input }: { input: UpdateProjectInput },
      { dataSources }: { dataSources: AppDatasources }
    ) => dataSources.projectsAPI.updateProject(input),
    deleteProject: async (
      _: any,
      { projectId }: { projectId: Project['projectId'] },
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
    createGenericHook: getDatasourceWithInput<CreateGenericHookInput>(
      'projectsAPI.createGenericHook'
    ),
    updateGenericHook: getDatasourceWithInput<UpdateGenericHookInput>(
      'projectsAPI.updateGenericHook'
    ),
    createBitbucketHook: getDatasourceWithInput<CreateBitbucketHookInput>(
      'projectsAPI.createBitbucketHook'
    ),
    updateBitbucketHook: getDatasourceWithInput<UpdateBitbucketHookInput>(
      'projectsAPI.updateBitbucketHook'
    ),
    createGithubHook: getDatasourceWithInput<CreateGithubHookInput>(
      'projectsAPI.createGithubHook'
    ),
    updateGithubHook: getDatasourceWithInput<UpdateGithubHookInput>(
      'projectsAPI.updateGithubHook'
    ),
    createSlackHook: getDatasourceWithInput<CreateSlackHookInput>(
      'projectsAPI.createSlackHook'
    ),
    updateSlackHook: getDatasourceWithInput<UpdateSlackHookInput>(
      'projectsAPI.updateSlackHook'
    ),
    createTeamsHook: getDatasourceWithInput<CreateTeamsHookInput>(
      'projectsAPI.createTeamsHook'
    ),
    updateTeamsHook: getDatasourceWithInput<UpdateTeamsHookInput>(
      'projectsAPI.updateTeamsHook'
    ),
    createGChatHook: getDatasourceWithInput<CreateGChatHookInput>(
      'projectsAPI.createGChatHook'
    ),
    updateGChatHook: getDatasourceWithInput<UpdateGChatHookInput>(
      'projectsAPI.updateGChatHook'
    ),
    deleteHook: getDatasourceWithInput<DeleteHookInput>(
      'projectsAPI.deleteHook'
    ),
  },
};
