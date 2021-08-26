import { Collection } from '@sorry-cypress/mongo';
import { DataSource } from 'apollo-datasource';

export class RunTimeoutAPI extends DataSource {
  deleteRunTimeouts(runId: string) {
    return Collection.runTimeout().deleteMany({
      runId,
    });
  }
}
