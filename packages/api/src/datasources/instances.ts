import { DataSource } from 'apollo-datasource';
import { init, getMongoDB } from '@src/lib/mongo';

const reducer = mongoRun => mongoRun;

export class InstancesAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getInstanceById(id: string) {
    const response = await getMongoDB()
      .collection('instances')
      .findOne({ instanceId: id });

    return reducer(response);
  }
}
