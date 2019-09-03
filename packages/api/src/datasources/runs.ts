import { DataSource } from 'apollo-datasource';
import { init, getMongoDB } from '@src/lib/mongo';

const runReducer = mongoRun => mongoRun;

export class RunsAPI extends DataSource {
  async initialize() {
    console.log('init');
    await init();
  }

  async getAllRuns() {
    const response = await getMongoDB()
      .collection('runs')
      .find({})
      .toArray();

    return response.map(runReducer);
  }

  async getRunById(id: string) {
    const response = await getMongoDB()
      .collection('runs')
      .findOne({ runId: id });

    return runReducer(response);
  }
}
