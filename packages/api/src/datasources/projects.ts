import { hookTypes } from '@src/duplicatedFromDirector/hooksEnums';
import { getMongoDB, init } from '@src/lib/mongo';
import { DataSource } from 'apollo-datasource';
import uuid from 'uuid/v4';

const filtersToAggregations = (filters) => {
  return filters
    ? filters.map((filter) => {
        return {
          $match: {
            [filter.key]: filter.value,
          },
        };
      })
    : [];
};

const getSortByAggregation = (direction = 'DESC') => ({
  $sort: {
    _id: direction === 'DESC' ? -1 : 1,
  },
});

const addHookIdsToProjectHooks = (project)=>{
  if (project && project.hooks) {
    project.hooks = project.hooks.map((hook)=>{
      hook.hookId = hook.hookId || uuid();
      return hook;
    })
  }
  return project;
}

const removeUnusedHookDataFromProject = (project)=>{
  if (project && project.hooks) {
    project.hooks = project.hooks.map((hook)=>{
      if (hook.hookType === hookTypes.GENERIC_HOOK) {
        delete hook.githubToken;
      }
      if (hook.hookType === hookTypes.GITHUB_STATUS_HOOK) {
        delete hook.headers;
        delete hook.hookEvents;
      }
      return hook;
    });
  }
  return project;
}

const restoreGithubTokensOnGithubHooks = async (updatedProject, getProjectById)=>{
  const oldProject = await getProjectById(updatedProject.projectId);

  // This is to ensure that we keep github tokens when the user only updaing the url
  if (updatedProject && updatedProject.hooks) {
    updatedProject.hooks = updatedProject.hooks.map((hook)=>{
      if (!hook.githubToken) {
        const oldhook = oldProject && oldProject.hooks && oldProject.hooks.find((oldHook)=>(oldHook.hookId === hook.hookId));
        if (oldhook && oldhook.githubToken) {
          hook.githubToken = oldhook.githubToken;
        }
      }
      return hook;
    });
  }
  return updatedProject;
}

export class ProjectsAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getProjectById(id: string) {
    const result = getMongoDB()
      .collection('projects')
      .aggregate([{
          $match: {
            projectId: id
          }
        }
      ]);

    return (await result.toArray()).pop();
  }

  async createProject(project) {
    project = addHookIdsToProjectHooks(project);
    project = removeUnusedHookDataFromProject(project);
    await getMongoDB()
      .collection('projects')
      .insertOne(project);
    // this needs sanitization and validation it would be great to share the logic between director and the api.
    // its hard to do with the seperate yarn workspaces.
    return project;
  }

  async updateProject(project) {
    project = addHookIdsToProjectHooks(project);
    project = removeUnusedHookDataFromProject(project);
    project = await restoreGithubTokensOnGithubHooks(project, this.getProjectById);

    await getMongoDB()
      .collection('projects')
      .replaceOne({'projectId':project.projectId}, project);
    return project;
  }

  async getProjects({ orderDirection, filters }) {
    const aggregationPipeline = filtersToAggregations(filters)
      .concat([getSortByAggregation(orderDirection)])
      .filter((i) => !!i);

    const results = await getMongoDB()
      .collection('projects')
      .aggregate(aggregationPipeline)
      .toArray();

    return results;
  }

  async deleteProjectsByIds(projectIds: string[]) {
    const projectResult = await getMongoDB()
      .collection('projects')
      .deleteMany({
        projectId: {
          $in: projectIds,
        },
      });
    return {
      success: projectResult.result.ok === 1,
      message: `${projectResult.deletedCount} document${
        projectResult.deletedCount > 1 ? 's' : ''
      } deleted`,
      projectIds: projectResult.result.ok === 1 ? projectIds : [],
    };
  }
}
