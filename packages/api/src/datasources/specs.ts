import { Collection } from '@sorry-cypress/mongo/dist';
import { SpecStats } from '@src/generated/graphql';
import { AggregationFilter, filtersToAggregations } from '@src/lib/query';
import { DataSource } from 'apollo-datasource';

interface SpecsAggregationResult {
  _id: string;
  avgWallClockDuration: number;
  count: number;
}
export class SpecsAPI extends DataSource {
  async getSpecStats({
    spec,
    filter,
  }: {
    spec: string;
    filter: AggregationFilter[];
  }): Promise<SpecStats> {
    const pipeline = [
      ...filtersToAggregations(filter),
      {
        $match: {
          spec,
        },
      },
      {
        $project: {
          spec: 1,
          'results.stats': 1,
        },
      },
      {
        $group: {
          _id: '$spec',
          avgWallClockDuration: {
            $avg: '$results.stats.wallClockDuration',
          },
          count: {
            $sum: 1,
          },
        },
      },
    ];

    const results = await (
      await Collection.instance().aggregate<SpecsAggregationResult>(pipeline)
    ).toArray();

    const result = results.pop();
    if (!result) {
      return null;
    }
    return {
      ...result,
      spec: result._id,
      avgWallClockDuration: Math.floor(result.avgWallClockDuration),
    };
  }
}
