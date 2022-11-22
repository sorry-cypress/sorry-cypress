import {
  CreateBitbucketHookInput,
  CreateGChatHookInput,
  CreateGenericHookInput,
  CreateGithubHookInput,
  CreateProjectInput,
  CreateSlackHookInput,
  CreateTeamsHookInput,
  DeleteHookInput,
  Hook,
  OrderingOptions,
  Project,
  UpdateBitbucketHookInput,
  UpdateGChatHookInput,
  UpdateGenericHookInput,
  UpdateGithubHookInput,
  UpdateProjectInput,
  UpdateSlackHookInput,
  UpdateTeamsHookInput,
} from '@sorry-cypress/api/generated/graphql';
import {
  AggregationFilter,
  filtersToAggregations,
  getSortByAggregation,
} from '@sorry-cypress/api/lib/query';
import { getCreateProjectValue, HookType } from '@sorry-cypress/common';
import { Collection } from '@sorry-cypress/mongo';
import { DataSource } from 'apollo-datasource';
import { isNil, negate } from 'lodash';
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
  createTeamsHook = getCreateHook<CreateTeamsHookInput>(HookType.TEAMS_HOOK, {
    hookEvents: [],
  });
  createGChatHook = getCreateHook<CreateGChatHookInput>(HookType.GCHAT_HOOK, {
    hookEvents: [],
  });
  updateGenericHook = getUpdateHook<UpdateGenericHookInput>(
    HookType.GENERIC_HOOK
  );
  updateSlackHook = getUpdateHook<UpdateSlackHookInput>(HookType.SLACK_HOOK);
  updateTeamsHook = getUpdateHook<UpdateTeamsHookInput>(HookType.TEAMS_HOOK);
  updateGChatHook = getUpdateHook<UpdateGChatHookInput>(HookType.GCHAT_HOOK);
  updateGithubHook = updateGithubHook;
  updateBitbucketHook = updateBitbucketHook;
  deleteHook = deleteHook;

  async getProjectById(id: string): Promise<Project | null> {
    const project = await Collection.project().findOne({ projectId: id });
    if (!project) {
      return null;
    }
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
        projectInput.inactivityTimeoutSeconds,
        projectInput.projectColor
      );
      await Collection.project().insertOne(project);
      return project;
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new Error('Duplicate projectId');
      }
      throw error;
    }
  }

  async updateProject(input: UpdateProjectInput) {
    await Collection.project().updateOne(
      { projectId: input.projectId },
      {
        $set: {
          inactivityTimeoutSeconds: input.inactivityTimeoutSeconds,
          projectColor: input.projectColor,
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

    const results = await Collection.project()
      .aggregate(aggregationPipeline)
      .toArray();

    return results.map((p) => ({
      ...p,
      hooks: (p.hooks || []).map(removeSecrets),
    }));
  }

  async deleteProjectsByIds(projectIds: string[]) {
    const projectResult = await Collection.project().deleteMany({
      projectId: {
        $in: projectIds,
      },
    });
    return {
      success: projectResult.result.ok === 1,
      message: `Deleted ${projectResult.deletedCount ?? 0} item(s)`,
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
    hookType,
    url: '',
    ...defaults,
    hookId: uuid(),
  };
  await Collection.project().updateOne(
    { projectId: input.projectId },
    {
      $addToSet: {
        // @ts-ignore 😤
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
    await Collection.project().updateOne(
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

  const $set: Record<string, string | undefined> = {
    'hooks.$[hooks].url': hook.url ?? undefined,
    'hooks.$[hooks].bitbucketUsername': hook.bitbucketUsername,
    'hooks.$[hooks].bitbucketBuildName': hook.bitbucketBuildName ?? undefined,
  };
  if (hook.bitbucketToken) {
    $set['hooks.$[hooks].bitbucketToken'] = hook.bitbucketToken;
  }

  await Collection.project().updateOne(
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

  const $set: Record<string, string | undefined> = {
    'hooks.$[hooks].url': hook.url,
    'hooks.$[hooks].githubContext': hook.githubContext ?? undefined,
    'hooks.$[hooks].githubAuthType': hook.githubAuthType ?? undefined,
    'hooks.$[hooks].githubAppId': hook.githubAppId ?? undefined,
    'hooks.$[hooks].githubAppInstallationId':
      hook.githubAppInstallationId ?? undefined,
  };

  if (hook.githubAppPrivateKey) {
    $set['hooks.$[hooks].githubAppPrivateKey'] = hook.githubAppPrivateKey;
    $set['hooks.$[hooks].githubToken'] = undefined;
  }

  if (hook.githubToken) {
    $set['hooks.$[hooks].githubAppPrivateKey'] = undefined;
    $set['hooks.$[hooks].githubAppId'] = undefined;
    $set['hooks.$[hooks].githubAppInstallationId'] = undefined;
    $set['hooks.$[hooks].githubToken'] = hook.githubToken;
  }

  await Collection.project().updateOne(
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
  await Collection.project().updateOne(
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
