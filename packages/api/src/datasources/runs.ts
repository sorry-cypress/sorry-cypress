import { PAGE_ITEMS_LIMIT } from '@sorry-cypress/api/config';
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
      getLogger().error({ error }, 'Error wihle getting all runs...');
      throw error;
    }
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
      success: result.acknowledged === true,
      message: `Deleted ${result.deletedCount ?? 0} item(s)`,
      runIds: result.acknowledged === true ? runIds : [],
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
