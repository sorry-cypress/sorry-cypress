import {
  BitBucketHook,
  GithubHook,
  Hook,
  isBitbucketHook,
  isGenericHook,
  isGithubHook,
  isSlackHook,
} from '@sorry-cypress/common';
import {
  HookInput,
  OrderingOptions,
  Project,
  ProjectInput,
} from '@src/generated/graphql';
import { getProjectsCollection, init } from '@src/lib/mongo';
import {
  AggregationFilter,
  filtersToAggregations,
  getSortByAggregation,
} from '@src/lib/query';
import { DataSource } from 'apollo-datasource';
import { isNil, negate, pick } from 'lodash';
import plur from 'plur';
import { v4 as uuid } from 'uuid';

interface IProjectsAPI extends DataSource {
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: ProjectInput): Promise<Project>;
  updateProject(project: ProjectInput): Promise<Project>;
  getProjects({
    orderDirection,
    filters,
  }: {
    orderDirection: OrderingOptions;
    filters: AggregationFilter[];
  }): Promise<Project[]>;
}

export class ProjectsAPI extends DataSource implements IProjectsAPI {
  async initialize() {
    await init();
  }

  async getProjectById(id: string) {
    const result = await getProjectsCollection().aggregate<Project>([
      {
        $match: {
          projectId: id,
        },
      },
    ]);

    return (await result.toArray()).pop();
  }

  async createProject(projectInput: ProjectInput) {
    if (!projectInput.projectId) {
      throw new Error('Missing projectId');
    }

    try {
      const project = getCreateProjectValue(projectInput);
      await getProjectsCollection().insertOne(project);
      return project;
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new Error('Duplicate projectId');
      }
      throw error;
    }
  }

  async updateProject(projectInput: ProjectInput) {
    const project = getUpdateProjectValue(
      projectInput,
      await this.getProjectById(projectInput.projectId)
    );

    await getProjectsCollection().replaceOne(
      { projectId: project.projectId },
      project
    );

    return project;
  }

  async getProjects({
    orderDirection,
    filters,
  }: {
    orderDirection: OrderingOptions;
    filters: AggregationFilter[];
  }) {
    const aggregationPipeline = [
      ...filtersToAggregations(filters),
      getSortByAggregation(orderDirection),
    ].filter(negate(isNil));

    const results = await getProjectsCollection()
      .aggregate(aggregationPipeline)
      .toArray();

    return results;
  }

  async deleteProjectsByIds(projectIds: string[]) {
    const projectResult = await getProjectsCollection().deleteMany({
      projectId: {
        $in: projectIds,
      },
    });
    return {
      success: projectResult.result.ok === 1,
      message: `Deleted ${projectResult.deletedCount} ${plur(
        'project',
        projectResult.deletedCount
      )}`,
      projectIds: projectResult.result.ok === 1 ? projectIds : [],
    };
  }
}

export function getUpdateProjectValue(
  projectInput: ProjectInput,
  originalProject: Project
) {
  return {
    ...projectInput,
    hooks: projectInput.hooks
      .map(removeSensitiveData)
      .map(addHookId)
      .map((hook) => restoreSensitiveData(hook, originalProject)),
  } as Project;
}

export function getCreateProjectValue(projectInput: ProjectInput) {
  return {
    projectId: projectInput.projectId.trim(),
    hooks: projectInput.hooks
      .map(addHookId)
      .map(removeSensitiveData) as HookInputWithId[],
    createdAt: new Date().toString(),
    inactivityTimeoutSeconds: projectInput.inactivityTimeoutSeconds ?? 180,
  } as Project;
}
type HookInputWithId = HookInput & { hookId: string };

const addHookId = (hook: HookInput): HookInputWithId => ({
  ...hook,
  hookId: hook.hookId || uuid(),
});

export const genericHookFields = [
  'hookId',
  'url',
  'hookType',
  'headers',
  'hookEvents',
];
export const githubHookFields = [
  'hookId',
  'url',
  'hookType',
  'githubToken',
  'githubContext',
];
export const bitbucketHookFields = [
  'hookId',
  'url',
  'hookType',
  'bitbucketUsername',
  'bitbucketToken',
  'bitbucketBuildName',
];
export const slackHookFields = ['hookId', 'url', 'hookType', 'hookEvents'];

// Only keep specific data
const removeSensitiveData = (hook: HookInput) => {
  switch (true) {
    case isGenericHook(hook as Hook):
      return pick(hook, genericHookFields);
    case isGithubHook(hook as Hook):
      return pick(hook, githubHookFields);
    case isBitbucketHook(hook as Hook):
      return pick(hook, bitbucketHookFields);
    case isSlackHook(hook as Hook):
      return pick(hook, slackHookFields);
    default:
      return hook;
  }
};

// Restore sensitive data when updating hooks
const restoreSensitiveData = (
  hook: HookInput & { hookId: string },
  originalProject: Project
) => {
  const originalHook = originalProject.hooks.find(
    (i) => i.hookId === hook.hookId
  );
  if (!originalHook) {
    return hook;
  }
  switch (true) {
    case isGithubHook(hook as Hook):
      return {
        ...hook,

        githubToken:
          hook.githubToken ?? (originalHook as GithubHook).githubToken,
      };
    case isBitbucketHook(hook as Hook):
      return {
        ...hook,
        bitbucketToken:
          hook.bitbucketToken ?? (originalHook as BitBucketHook).bitbucketToken,
        bitbucketUsername:
          hook.bitbucketUsername ??
          (originalHook as BitBucketHook).bitbucketUsername,
      };
    default:
      return { ...hook };
  }
};
