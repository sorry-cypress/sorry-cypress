import { getMongoDB, init } from '@src/lib/mongo';
import { DataSource } from 'apollo-datasource';

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
    const { result } = await getMongoDB()
    .collection('projects')
    .insertOne(project);
    // this needs sanitization and validation it would be great to share the logic between director and the api.
    // its hard to do with the seperate yarn workspaces.
    return await result;
  }

  async updateProject(project) {
    const result = await getMongoDB()
      .collection('projects')
      .replaceOne({'projectId':project.projectId}, project);
    return result;
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
