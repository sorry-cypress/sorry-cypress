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
}
