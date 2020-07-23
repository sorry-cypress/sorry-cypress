import { getMongoDB, init, ObjectID } from '@src/lib/mongo';
import { DataSource } from 'apollo-datasource';

const DEFAULT_PAGE_SIZE = 5;

const mergeRunSpecs = (run) => {
  // merge fullspec into spec
  run.specs = run.specs.map((s) => ({
    ...s,
    ...(run.specsFull.find((full) => full.instanceId === s.instanceId) || {}),
  }));
  return run;
};

const fullRunReducer = (fullMongoRun) => fullMongoRun.map(mergeRunSpecs);

const getCursor = (runs, pageSize: number) => {
  if (!runs.length) {
    return 0;
  }

  if (runs.length > pageSize * 2) {
    return runs[runs.length - 2]._id;
  }

  return runs[runs.length - 1]._id;
};

const runFeedReducer = (runs, pageSize: number) => ({
  runs: runs.map(mergeRunSpecs),
  cursor: getCursor(runs, pageSize),
  hasMore: runs.length > pageSize * 2,
});

const matchRunAggregation = (runId: string) => ({
  $match: {
    runId,
  },
});

const getSortByAggregation = (direction = 'DESC') => ({
  $sort: {
    _id: direction === 'DESC' ? -1 : 1,
  },
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
        in: '$$spec.instanceId',
      },
    },
  },
};

const lookupAggregation = {
  $lookup: {
    from: 'instances',
    localField: 'specsFull',
    foreignField: 'instanceId',
    as: 'specsFull',
  },
};

export interface GetRunFeedParam {
  startCursor: string;
  endCursor: string;
  pageSize: number;
}
export class RunsAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getRunFeed({ startCursor, endCursor, pageSize }: GetRunFeedParam) {
    const _pageSize = pageSize || DEFAULT_PAGE_SIZE;

    const aggregationPipeline = [
      getSortByAggregation(),
      startCursor
        ? {
            $match: {
              _id: { $lt: new ObjectID(startCursor) },
            },
          }
        : null,
      endCursor
        ? {
            $match: {
              _id: { $gt: new ObjectID(endCursor) },
            },
          }
        : {
            // get one extra to know if there's more
            $limit: _pageSize * 2 + 1,
          },
      projectAggregation,
      lookupAggregation,
    ].filter((i) => !!i);

    const results = await (
      await getMongoDB().collection('runs').aggregate(aggregationPipeline)
    ).toArray();

    return runFeedReducer(results, pageSize);
  }

  async getAllRuns({ orderDirection }) {
    const aggregationPipeline = [
      getSortByAggregation(orderDirection),
      projectAggregation,
      lookupAggregation,
    ].filter((i) => !!i);

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
        lookupAggregation,
      ]);

    return fullRunReducer(await result.toArray()).pop();
  }

  async deleteRunsByIds(runIds: string[]) {
    const result = await getMongoDB()
      .collection('runs')
      .deleteMany({
        runId: {
          $in: runIds,
        },
      });
    return {
      success: result.result.ok === 1,
      message: `${result.deletedCount} document${
        result.deletedCount > 1 ? 's' : ''
      } deleted`,
      runIds: result.result.ok === 1 ? runIds : [],
    };
  }

  async deleteRunsInDateRange(startDate: Date, endDate: Date) {
    if (startDate > endDate) {
      return {
        success: false,
        message: `startDate: ${startDate.toISOString()} should be less than endDate: ${endDate.toISOString()}`,
        runIds: [],
      };
    }
    const response = await getMongoDB()
      .collection('runs')
      .find({
        createdAt: {
          $lte: endDate.toISOString(),
          $gte: startDate.toISOString(),
        },
      })
      .toArray();
    const runIds = response.map((x) => x.runId) as string[];
    return await this.deleteRunsByIds(runIds);
  }
}
