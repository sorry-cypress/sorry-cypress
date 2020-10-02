import { hookTypes } from '@src/duplicatedFromDirector/hooksEnums';
import { Project } from '@src/duplicatedFromDirector/project.types';
import { getMongoDB, init } from '@src/lib/mongo';

import {
  getSortByAggregation,
  filtersToAggregations,
  AggregationFilter,
} from '@src/lib/query';
import { DataSource } from 'apollo-datasource';
import { v4 as uuid } from 'uuid';
import { negate, isNil } from 'lodash';
import { OrderingOptions } from '@src/generated/graphql';
import plur from 'plur';

const addHookIdsToProjectHooks = (project: Project) => {
  if (!project?.hooks) {
    return project;
  }

  project.hooks = project.hooks.map((hook) => {
    hook.hookId = hook.hookId || uuid();
    return hook;
  });

  return project;
};

const removeUnusedHookDataFromProject = (project: Project) => {
  if (!project?.hooks) {
    return project;
  }

  project.hooks = project.hooks.map((hook) => {
    if (hook.hookType === hookTypes.GENERIC_HOOK) {
      delete hook.githubToken;
    }
    if (hook.hookType === hookTypes.GITHUB_STATUS_HOOK) {
      delete hook.headers;
      delete hook.hookEvents;
    }
    return hook;
  });

  return project;
};

const restoreGithubTokensOnGithubHooks = async (
  updatedProject: Project,
  getProjectById: ProjectsAPI['getProjectById']
) => {
  const oldProject = await getProjectById(updatedProject.projectId);

  // This is to ensure that we keep github tokens when the user only updaing the url
  if (updatedProject?.hooks) {
    updatedProject.hooks = updatedProject.hooks.map((hook) => {
      if (!hook.githubToken) {
        const oldhook = oldProject?.hooks?.find(
          (oldHook) => oldHook.hookId === hook.hookId
        );
        if (oldhook?.githubToken) {
          hook.githubToken = oldhook.githubToken;
        }
      }
      return hook;
    });
  }
  return updatedProject;
};

interface IProjectsAPI extends DataSource {
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: Project): Promise<Project>;
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
    const result = getMongoDB()
      .collection('projects')
      .aggregate<Project>([
        {
          $match: {
            projectId: id,
          },
        },
      ]);

    return (await result.toArray()).pop();
  }

  async createProject(project: Project) {
    project = addHookIdsToProjectHooks(project);
    project = removeUnusedHookDataFromProject(project);
    await getMongoDB().collection('projects').insertOne(project);
    // this needs sanitization and validation it would be great to share the logic between director and the api.
    // its hard to do with the seperate yarn workspaces.
    return project;
  }

  async updateProject(project: Project) {
    project = addHookIdsToProjectHooks(project);
    project = removeUnusedHookDataFromProject(project);
    project = await restoreGithubTokensOnGithubHooks(
      project,
      this.getProjectById
    );

    await getMongoDB()
      .collection('projects')
      .replaceOne({ projectId: project.projectId }, project);
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

    const results = await getMongoDB()
      .collection<Project>('projects')
      .aggregate(aggregationPipeline)
      .toArray();

    return results;
  }

  async deleteProjectsByIds(projectIds: string[]) {
    const projectResult = await getMongoDB()
      .collection<Project>('projects')
      .deleteMany({
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
