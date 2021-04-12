import { Instance, Run } from '@sorry-cypress/common';
import { OrderingOptions } from '@src/generated/graphql';
import { getMongoDB, init, ObjectID } from '@src/lib/mongo';
import {
  AggregationFilter,
  filtersToAggregations,
  getSortByAggregation,
} from '@src/lib/query';
import { DataSource } from 'apollo-datasource';
import { isNil, negate } from 'lodash';
import { WithId } from 'mongodb';

type RunWithFullSpecs = Run & {
  specsFull: Instance[];
} & {
  _id: string;
};

const PAGE_LIMIT = 10;
const mergeRunSpecs = (run: RunWithFullSpecs) => {
  // merge fullspec into spec
  run.specs = run.specs.map((s) => ({
    ...s,
    ...(run.specsFull.find((full) => full.instanceId === s.instanceId) || {}),
  }));
  return run;
};

const getCursor = (runs: WithId<Run>[]) => {
  if (!runs.length) {
    return 0;
  }

  if (runs.length > PAGE_LIMIT) {
    return runs[runs.length - 2]._id;
  }

  return runs[runs.length - 1]._id;
};

const runFeedReducer = (runs: WithId<Run>[]) => ({
  runs: runs.slice(0, PAGE_LIMIT),
  cursor: getCursor(runs),
  hasMore: runs.length > PAGE_LIMIT,
});

const matchRunAggregation = (runId: string) => ({
  $match: {
    runId,
  },
});

const projectAggregation = {
  $project: {
    _id: 1,
    runId: 1,
    meta: 1,
    specs: 1,
    createdAt: 1,
    completion: 1,
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

export class RunsAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getRunFeed({
    cursor,
    filters,
  }: {
    filters: AggregationFilter[];
    cursor: string | false;
  }) {
    const aggregationPipeline = [
      ...filtersToAggregations(filters),
      getSortByAggregation(),
      cursor
        ? {
            $match: {
              _id: { $lt: new ObjectID(cursor) },
            },
          }
        : null,
      {
        // get one extra to know if there's more
        $limit: PAGE_LIMIT + 1,
      },
    ].filter(negate(isNil));

    const results = await (
      await getMongoDB().collection('runs').aggregate(aggregationPipeline)
    ).toArray();

    return runFeedReducer(results);
  }

  async getAllRuns({
    orderDirection,
    filters,
  }: {
    orderDirection: OrderingOptions;
    filters: AggregationFilter[];
  }) {
    const aggregationPipeline = [
      ...filtersToAggregations(filters),
      getSortByAggregation(orderDirection),
      projectAggregation,
      lookupAggregation,
    ].filter(negate(isNil));

    const results = (await getMongoDB()
      .collection<Run>('runs')
      .aggregate(aggregationPipeline)
      .toArray()) as RunWithFullSpecs[];

    return results.map(mergeRunSpecs);
  }

  async getRunById(id: string) {
    const result = (await getMongoDB()
      .collection<Run>('runs')
      .aggregate([
        matchRunAggregation(id),
        projectAggregation,
        lookupAggregation,
      ])
      .toArray()) as RunWithFullSpecs[];

    return result.map(mergeRunSpecs).pop();
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
    const response = (await getMongoDB()
      .collection('runs')
      .find({
        createdAt: {
          $lte: endDate.toISOString(),
          $gte: startDate.toISOString(),
        },
      })
      .toArray()) as Run[];
    const runIds = response.map((x) => x.runId) as string[];
    return await this.deleteRunsByIds(runIds);
  }
}
