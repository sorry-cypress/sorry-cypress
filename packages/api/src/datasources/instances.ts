import { DataSource } from 'apollo-datasource';
import { init, getMongoDB } from '@src/lib/mongo';

const getInstanceReducer = (mongoRuns) => {
  if (mongoRuns.length === 0) {
    return null;
  }
  const result = mongoRuns.pop();
  result.run = result.run.pop();
  return result;
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
    const response = await getMongoDB()
      .collection('instances')
      .aggregate([
        {
          $match: { instanceId },
        },
        lookupAggregation,
      ])
      .toArray();

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
      message: `${result.deletedCount} document${
        result.deletedCount > 1 ? 's' : ''
      } deleted`,
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
    const response = await getMongoDB()
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
      .toArray();

    const runIds = response.map((x) => x.run[0].runId) as string[];
    return await this.deleteInstancesByRunIds(runIds);
  }
}
