import { SpecStats } from '@src/generated/graphql';
import { getMongoDB, init } from '@src/lib/mongo';
import { AggregationFilter, filtersToAggregations } from '@src/lib/query';
import { DataSource } from 'apollo-datasource';

export class SpecsAPI extends DataSource {
  async initialize() {
    await init();
  }

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
      await getMongoDB().collection('instances').aggregate(pipeline)
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
