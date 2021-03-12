import { getCreateProjectValue, HookType } from '@sorry-cypress/common';
import {
  CreateBitbucketHookInput,
  CreateGenericHookInput,
  CreateGithubHookInput,
  CreateProjectInput,
  CreateSlackHookInput,
  DeleteHookInput,
  Hook,
  OrderingOptions,
  Project,
  UpdateBitbucketHookInput,
  UpdateGenericHookInput,
  UpdateGithubHookInput,
  UpdateProjectInput,
  UpdateSlackHookInput,
} from '@src/generated/graphql';
import { getProjectsCollection, init } from '@src/lib/mongo';
import {
  AggregationFilter,
  filtersToAggregations,
  getSortByAggregation,
} from '@src/lib/query';
import { DataSource } from 'apollo-datasource';
import { isNil, negate } from 'lodash';
import plur from 'plur';
import { v4 as uuid } from 'uuid';

export class ProjectsAPI extends DataSource {
  createGenericHook = getCreateHook<CreateGenericHookInput>(
    HookType.GENERIC_HOOK,
    {
      hookEvents: [],
    }
  );
  createBitbucketHook = getCreateHook<CreateBitbucketHookInput>(
    HookType.BITBUCKET_STATUS_HOOK
  );
  createGithubHook = getCreateHook<CreateGithubHookInput>(
    HookType.GITHUB_STATUS_HOOK
  );
  createSlackHook = getCreateHook<CreateSlackHookInput>(HookType.SLACK_HOOK, {
    hookEvents: [],
  });
  updateGenericHook = getUpdateHook<UpdateGenericHookInput>(
    HookType.GENERIC_HOOK
  );
  updateSlackHook = getUpdateHook<UpdateSlackHookInput>(HookType.SLACK_HOOK);
  updateGithubHook = updateGithubHook;
  updateBitbucketHook = updateBitbucketHook;
  deleteHook = deleteHook;

  async initialize() {
    await init();
  }

  async getProjectById(id: string): Promise<Project> {
    const result = await getProjectsCollection().aggregate<Project>([
      {
        $match: {
          projectId: id,
        },
      },
    ]);

    const project = (await result.toArray()).pop();

    return {
      ...project,
      hooks: (project.hooks ?? []).map(removeSecrets),
    };
  }

  async createProject(projectInput: CreateProjectInput) {
    if (!projectInput.projectId) {
      throw new Error('Missing projectId');
    }

    try {
      const project = getCreateProjectValue(
        projectInput.projectId,
        projectInput.inactivityTimeoutSeconds
      ) as Project;
      await getProjectsCollection().insertOne(project);
      return project;
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new Error('Duplicate projectId');
      }
      throw error;
    }
  }

  async updateProject(input: UpdateProjectInput) {
    await getProjectsCollection().updateOne(
      { projectId: input.projectId },
      {
        $set: {
          inactivityTimeoutSeconds: input.inactivityTimeoutSeconds,
        },
      },
      {
        upsert: false,
      }
    );

    return this.getProjectById(input.projectId);
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

    return results.map((p) => ({
      ...p,
      hooks: (p.hooks || []).map(removeSecrets),
    }));
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

const getCreateHook = <T extends { projectId: string }>(
  hookType: HookType,
  defaults: Record<string, any> = {}
) => async (input: T) => {
  const hook = {
    ...input,
    hookId: uuid(),
    hookType,
    url: '',
    ...defaults,
  };
  await getProjectsCollection().updateOne(
    { projectId: input.projectId },
    {
      $addToSet: {
        hooks: hook,
      },
    },
    {
      upsert: false,
    }
  );

  return removeSecrets(hook);
};

const getUpdateHook = <T extends { projectId: string; hookId: string }>(
  hookType: HookType
) =>
  async function updateGenericHook(input: T) {
    const hook = { ...input, hookType };
    await getProjectsCollection().updateOne(
      { projectId: input.projectId },
      {
        $set: {
          'hooks.$[hooks]': hook,
        },
      },
      {
        arrayFilters: [{ 'hooks.hookId': input.hookId }],
        upsert: false,
      }
    );

    return hook;
  };

async function updateBitbucketHook(input: UpdateBitbucketHookInput) {
  const hook = { ...input, hookType: HookType.BITBUCKET_STATUS_HOOK };

  const $set: Record<string, string> = {
    'hooks.$[hooks].url': hook.url,
    'hooks.$[hooks].bitbucketUsername': hook.bitbucketUsername,
    'hooks.$[hooks].bitbucketBuildName': hook.bitbucketBuildName,
  };
  if (hook.bitbucketToken) {
    $set['hooks.$[hooks].bitbucketToken'] = hook.bitbucketToken;
  }

  await getProjectsCollection().updateOne(
    { projectId: input.projectId },
    {
      $set,
    },
    {
      arrayFilters: [{ 'hooks.hookId': input.hookId }],
      upsert: false,
    }
  );

  return removeSecrets(hook);
}

async function updateGithubHook(input: UpdateGithubHookInput) {
  const hook = { ...input, hookType: HookType.GITHUB_STATUS_HOOK };

  const $set: Record<string, string> = {
    'hooks.$[hooks].url': hook.url,
    'hooks.$[hooks].githubContext': hook.githubContext,
  };
  if (hook.githubToken) {
    $set['hooks.$[hooks].githubToken'] = hook.githubToken;
  }

  await getProjectsCollection().updateOne(
    { projectId: input.projectId },
    {
      $set,
    },
    {
      arrayFilters: [{ 'hooks.hookId': input.hookId }],
      upsert: false,
    }
  );

  return removeSecrets(hook);
}

async function deleteHook(input: DeleteHookInput) {
  const { projectId, hookId } = input;
  await getProjectsCollection().updateOne(
    { projectId: projectId },
    {
      $pull: {
        hooks: { hookId },
      },
    },
    {
      upsert: false,
    }
  );

  return { projectId, hookId };
}

export function getUpdateProjectValue(
  projectInput: UpdateProjectInput,
  originalProject: Project
) {
  return {
    ...projectInput,
    hooks: originalProject.hooks,
  } as Project;
}

function removeSecrets(hook: Hook) {
  return {
    ...hook,
    githubToken: hook.githubToken ? 'secret' : null,
    bitbucketToken: hook.bitbucketToken ? 'secret' : null,
  };
}
