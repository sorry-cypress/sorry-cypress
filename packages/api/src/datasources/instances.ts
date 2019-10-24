import { DataSource } from 'apollo-datasource';
import { init, getMongoDB } from '@src/lib/mongo';

const reducer = mongoRuns => {
  if (mongoRuns.length === 0) {
    return null;
  }
  const result = mongoRuns.pop();
  result.run = result.run.pop();
  return result;
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
          $match: { instanceId }
        },
        {
          $lookup: {
            from: 'runs',
            localField: 'runId',
            foreignField: 'runId',
            as: 'run'
          }
        }
      ])
      .toArray();

    return reducer(response);
  }
}
