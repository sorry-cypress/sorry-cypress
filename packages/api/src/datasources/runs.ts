import { DataSource } from 'apollo-datasource';
import { init, getMongoDB, ObjectID } from '@src/lib/mongo';

const PAGE_LIMIT = 5;
const mergeRunSpecs = run => {
  // merge fullspec into spec
  run.specs = run.specs.map(s => ({
    ...s,
    ...(run.specsFull.find(full => full.instanceId === s.instanceId) || {})
  }));
  return run;
};

const fullRunReducer = fullMongoRun => fullMongoRun.map(mergeRunSpecs);

const getCursor = runs => {
  if (!runs.length) {
    return 0;
  }

  if (runs.length > PAGE_LIMIT) {
    return runs[runs.length - 2]._id;
  }

  return runs[runs.length - 1]._id;
};

const runFeedReducer = runs => ({
  runs: runs.slice(0, PAGE_LIMIT).map(mergeRunSpecs),
  cursor: getCursor(runs),
  hasMore: runs.length > PAGE_LIMIT
});

const matchRunAggregation = (runId: string) => ({
  $match: {
    runId
  }
});

const getSortByAggregation = (direction = 'DESC') => ({
  $sort: {
    _id: direction === 'DESC' ? -1 : 1
  }
});

const projectAggregation = {
  $project: {
    _id: 1,
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

export class RunsAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getRunFeed({ cursor }) {
    const aggregationPipeline = [
      getSortByAggregation(),
      cursor
        ? {
            $match: {
              _id: { $lt: new ObjectID(cursor) }
            }
          }
        : null,
      {
        // get one extra to know if there's more
        $limit: PAGE_LIMIT + 1
      },
      projectAggregation,
      lookupAggregation
    ].filter(i => !!i);

    const results = await (
      await getMongoDB()
        .collection('runs')
        .aggregate(aggregationPipeline)
    ).toArray();

    return runFeedReducer(results);
  }

  async getAllRuns({ orderDirection }) {
    const aggregationPipeline = [
      getSortByAggregation(orderDirection),
      projectAggregation,
      lookupAggregation
    ].filter(i => !!i);

    const results = await getMongoDB()
      .collection('runs')
      .aggregate(aggregationPipeline)
      .toArray();

    return fullRunReducer(results);
  }

  async getRunById(id: string) {
    const result = getMongoDB()
      .collection('runs')
      .aggregate([
        matchRunAggregation(id),
        projectAggregation,
        lookupAggregation
      ]);

    return fullRunReducer(await result.toArray()).pop();
  }
}
