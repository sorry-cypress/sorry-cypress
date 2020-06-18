import { getMongoDB, init, ObjectID } from '@src/lib/mongo';
import { DataSource } from 'apollo-datasource';

const PAGE_LIMIT = 5;
const NB_RUNNER = 25;

const mergeRunSpecs = (run) => {
  // merge fullspec into spec
  run.specs = run.specs.map((s) => ({
    ...s,
    ...(run.specsFull.find((full) => full.instanceId === s.instanceId) || {}),
  }));
  return run;
};

const fullRunReducer = (fullMongoRun) => fullMongoRun.map(mergeRunSpecs);

const getCursor = (runs) => {
  if (!runs.length) {
    return 0;
  }

  if (runs.length > PAGE_LIMIT) {
    return runs[runs.length - 2].lastRunId;
  }

  return runs[runs.length - 1].lastRunId;
};

const runFeedReducer = (runs) => ({
  runs: runs.slice(0, PAGE_LIMIT).map(mergeRunSpecs),
  cursor: getCursor(runs),
  hasMore: runs.length > PAGE_LIMIT,
});

const matchRunAggregation = (runId: string) => ({
  $match: {
    'meta.ciBuildId': runId,
  },
});

const matchBranchAggregation = (branch: string) => ({
  $match: {
    'meta.commit.branch': branch,
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
    agents: 1,
    createdAt: 1,
    lastRunId: 1,
    specsFull: {
      $map: {
        input: '$specs',
        as: 'spec',
        in: '$$spec.instanceId',
      },
    },
  },
};

const unwindAggregation = { $unwind: '$specs' };

const groupAggregation = {
  $group: {
    _id: '$meta.ciBuildId',
    agents: { $sum: 1 },
    meta: { $first: '$meta' },
    specs: { $push: '$specs' },
    createdAt: { $first: '$createdAt' },
    instanceId: { $push: '$instanceId' },
    lastRunId: { $last: '$_id' },
    runs: {
      $push: {
        _id: '$_id',
        runId: '$runId',
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

const projectRestrictedAggregation = {
  $project: {
    _id: 1,
    runId: 1,
    meta: 1,
    specs: 1,
    agents: 1,
    createdAt: 1,
    lastRunId: 1,
    specsFull: {
      instanceId: 1,
      results: {
        stats: 1,
      },
    },
  },
};

export class RunsAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getRunFeed({ cursor, branch }) {
    const aggregationPipeline = [
      getSortByAggregation(),
      branch ? matchBranchAggregation(branch) : null,
      cursor
        ? {
            $match: {
              _id: { $lt: new ObjectID(cursor) },
            },
          }
        : null,
      {
        $limit: PAGE_LIMIT * (NB_RUNNER + 1), // First selection
      },
      unwindAggregation,
      groupAggregation,
      {
        // get one extra to know if there's more
        $limit: PAGE_LIMIT + 1,
      },
      projectAggregation,
      lookupAggregation,
      projectRestrictedAggregation,
    ].filter((i) => !!i);

    const results = await (
      await getMongoDB().collection('runs').aggregate(aggregationPipeline)
    ).toArray();

    return runFeedReducer(results);
  }

  async getBranches() {
    const result = await (
      await getMongoDB()
        .collection('runs')
        .aggregate([
          { $group: { _id: '$meta.commit.branch' } },
          { $project: { _id: true } },
        ])
    ).toArray();

    return result.map((item) => item._id);
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
        unwindAggregation,
        groupAggregation,
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
