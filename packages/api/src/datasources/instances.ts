import { Instance, Run } from '@sorry-cypress/common';
import { getMongoDB, init } from '@src/lib/mongo';
import { DataSource } from 'apollo-datasource';
import plur from 'plur';

type InstanceWithRuns = Instance & {
  run: Run[];
};
type InstanceWithRun = Instance & {
  run: Run;
};

const getInstanceReducer = (
  instanceWithRuns: InstanceWithRuns[]
): InstanceWithRun => {
  if (instanceWithRuns.length === 0) {
    return null;
  }
  const result = instanceWithRuns.pop();
  return { ...result, run: result.run.pop() };
};

const lookupAggregation = {
  $lookup: {
    from: 'runs',
    localField: 'runId',
    foreignField: 'runId',
    as: 'run',
  },
};

export class InstancesAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getInstanceById(instanceId: string) {
    const response = (await getMongoDB()
      .collection<Instance>('instances')
      .aggregate([
        {
          $match: { instanceId },
        },
        lookupAggregation,
      ])
      .toArray()) as InstanceWithRuns[];

    return getInstanceReducer(response);
  }

  async deleteInstancesByRunIds(runIds: string[]) {
    const result = await getMongoDB()
      .collection('instances')
      .deleteMany({
        runId: {
          $in: runIds,
        },
      });
    return {
      success: result.result.ok === 1,
      message: `${result.deletedCount} ${plur(
        'document',
        result.deletedCount
      )} deleted`,
      runIds: result.result.ok === 1 ? runIds : [],
    };
  }

  async deleteInstancesInDateRange(startDate: Date, endDate: Date) {
    if (startDate > endDate) {
      return {
        success: false,
        message: `startDate: ${startDate.toISOString()} should be less than endDate: ${endDate.toISOString()}`,
        runIds: [],
      };
    }
    const response = (await getMongoDB()
      .collection('instances')
      .aggregate([
        lookupAggregation,
        {
          $match: {
            'run.createdAt': {
              $lte: endDate.toISOString(),
              $gte: startDate.toISOString(),
            },
          },
        },
      ])
      .toArray()) as InstanceWithRuns[];

    const runIds = response.map((x) => x.run[0].runId) as string[];
    return await this.deleteInstancesByRunIds(runIds);
  }
}
