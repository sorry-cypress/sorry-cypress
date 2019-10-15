import { DataSource } from 'apollo-datasource';
import { init, getMongoDB } from '@src/lib/mongo';

const mergeRunSpecs = run => {
  // merge fullspec into spec
  run.specs = run.specs.map(s => ({
    ...s,
    ...(run.specsFull.find(full => full.instanceId === s.instanceId) || {})
  }));
  return run;
};

const fullRunReducer = fullMongoRun => fullMongoRun.map(mergeRunSpecs);

const matchRunAggregation = (runId: string) => ({
  $match: {
    runId
  }
});

const getSortByAggregation = (direction = 'DESC') => ({
  $sort: {
    createdAt: direction === 'DESC' ? -1 : 1
  }
});
const projectAggregation = {
  $project: {
    runId: 1,
    meta: 1,
    specs: 1,
    createdAt: 1,
    specsFull: {
      $map: {
        input: '$specs',
        as: 'spec',
        in: '$$spec.instanceId'
      }
    }
  }
};
const lookupAggregation = {
  $lookup: {
    from: 'instances',
    localField: 'specsFull',
    foreignField: 'instanceId',
    as: 'specsFull'
  }
};

const getFullRuns = async sortDirection =>
  await getMongoDB()
    .collection('runs')
    .aggregate([
      getSortByAggregation(sortDirection),
      projectAggregation,
      lookupAggregation
    ]);

export class RunsAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getAllRuns({ orderDirection }) {
    const result = await getFullRuns(orderDirection);
    return fullRunReducer(await result.toArray());
  }

  async getRunById(id: string) {
    const result = await getMongoDB()
      .collection('runs')
      .aggregate([
        matchRunAggregation(id),
        projectAggregation,
        lookupAggregation
      ]);

    return fullRunReducer(await result.toArray()).pop();
  }
}
