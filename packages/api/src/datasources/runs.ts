import { Instance, Run } from '@sorry-cypress/common';
import { Collection, ObjectId } from '@sorry-cypress/mongo';
import { OrderingOptions } from '@src/generated/graphql';
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

const projectAggregation = {
  $project: {
    _id: 1,
    runId: 1,
    meta: 1,
    specs: 1,
    createdAt: 1,
    completion: 1,
    specsFull: '$specs.instanceId',
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
              _id: { $lt: new ObjectId(cursor) },
            },
          }
        : null,
      {
        // get one extra to know if there's more
        $limit: PAGE_LIMIT + 1,
      },
    ].filter(negate(isNil));

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
      projectAggregation,
      lookupAggregation,
    ].filter(negate(isNil));

    const results = (await Collection.run()
      .aggregate(aggregationPipeline)
      .toArray()) as RunWithFullSpecs[];

    return results.map(mergeRunSpecs);
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
    const response = (await Collection.run()
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
