import {
  CI_BUILD_BATCH_SIZE,
  PAGE_ITEMS_LIMIT,
} from '@sorry-cypress/api/config';
import { OrderingOptions } from '@sorry-cypress/api/generated/graphql';
import {
  AggregationFilter,
  filtersToAggregations,
  getSortByAggregation,
} from '@sorry-cypress/api/lib/query';
import { Run } from '@sorry-cypress/common';
import { getLogger } from '@sorry-cypress/logger';
import { Collection, ObjectId } from '@sorry-cypress/mongo';
import { DataSource } from 'apollo-datasource';
import { isNil, negate } from 'lodash';
import { WithId } from 'mongodb';

const getCursor = (runs: WithId<Run>[]) => {
  if (!runs.length) {
    return 0;
  }

  if (runs.length > PAGE_ITEMS_LIMIT) {
    return runs[runs.length - 2]._id;
  }

  return runs[runs.length - 1]._id;
};

const runFeedReducer = (runs: WithId<Run>[]) => ({
  runs: runs.slice(0, PAGE_ITEMS_LIMIT),
  cursor: getCursor(runs),
  hasMore: runs.length > PAGE_ITEMS_LIMIT,
});

export class RunsAPI extends DataSource {
  async getRunFeed({
    cursor,
    filters,
  }: {
    filters: AggregationFilter[];
    cursor: string | false;
  }) {
    const aggregationPipeline: any[] = [
      ...filtersToAggregations(filters),
      getSortByAggregation(),
      {
        // get one extra to know if there's more
        $limit: PAGE_ITEMS_LIMIT + 1,
      },
    ];

    if (cursor) {
      aggregationPipeline.unshift({
        $match: {
          _id: { $lt: new ObjectId(cursor) },
        },
      });
    }

    const results = await (
      await Collection.run().aggregate<WithId<Run>>(aggregationPipeline)
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
    ].filter(negate(isNil));

    getLogger().log({ aggregationPipeline }, 'Getting all runs...');

    try {
      const results = (await Collection.run()
        .aggregate(aggregationPipeline)
        .toArray()) as Run[];
      return results;
    } catch (error) {
      getLogger().error({ error }, 'Error while getting all runs...');
      throw error;
    }
  }

  async getAllCiBuilds({ filters }: { filters: AggregationFilter[] }) {
    const aggregationPipeline = [
      ...filtersToAggregations(filters),
      { $sort: { _id: -1 } }, // order by most recent runs
      { $limit: CI_BUILD_BATCH_SIZE }, // performance improvement since group doesn't leverage indexes
      {
        $group: {
          _id: '$meta.ciBuildId',
          runs: { $push: '$$ROOT' },
          runId: { $min: '$_id' }, // oldest run
        },
      },
      { $sort: { runId: -1 } }, // sort groups by most recent runs
      { $limit: PAGE_ITEMS_LIMIT },
      {
        $addFields: {
          ciBuildId: '$_id',
          createdAt: { $arrayElemAt: ['$runs.createdAt', -1] }, // last run (first created)
          updatedAt: { $max: '$runs.progress.updatedAt' },
        },
      },
    ];

    getLogger().log({ aggregationPipeline }, 'Getting all ci builds...');

    const results = await Collection.run().aggregate(aggregationPipeline);
    return results.toArray();
  }

  getRunById(id: string) {
    return Collection.run().findOne({ runId: id });
  }

  async deleteRunsByIds(runIds: string[]) {
    const result = await Collection.run().deleteMany({
      runId: {
        $in: runIds,
      },
    });
    return {
      success: result.result.ok === 1,
      message: `Deleted ${result.deletedCount ?? 0} item(s)`,
      runIds: result.result.ok === 1 ? runIds : [],
    };
  }

  async getRunsInDateRange(startDate: Date, endDate: Date, limit: number = 0) {
    if (startDate > endDate) {
      return {
        success: false,
        message: `startDate: ${startDate.toISOString()} should be less than endDate: ${endDate.toISOString()}`,
        runIds: [],
      };
    }
    const response = await Collection.run()
      .find({
        createdAt: {
          $lte: endDate.toISOString(),
          $gte: startDate.toISOString(),
        },
      })
      .project({ _id: 0, runId: 1 })
      .limit(limit)
      .toArray();
    const runIds = response.map((x) => x.runId);
    return {
      success: true,
      message: `Found ${runIds.length ?? 0} item(s)`,
      runIds: runIds,
    };
  }
}
