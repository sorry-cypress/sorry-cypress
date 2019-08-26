import { createRun, setInstanceClaimed } from '../run.mjs';
import uuid from 'uuid/v4';

describe('test', () => {
  it('should pass', async () => {
    const newRun = {
      runId: uuid(),
      meta: {},
      specs: [
        {
          spec: 'aSpec',
          instanceId: uuid(),
          claimed: false
        }
      ]
    };
    await createRun(newRun);
    expect(true).toBe(true);
  });
});

db.getCollection('runs').updateOne(
  {
    runId: 'c96b420a3ae4eb486716774ab66bace2',
    specs: {
      instanceId: 'b55862e7-9623-46e5-8a1d-f88c851be435',
      claimed: false
    }
  },
  { $set: { 'specs.$[spec].claimed': true } },
  {
    arrayFilters: [
      { 'spec.instanceId': 'b55862e7-9623-46e5-8a1d-f88c851be435' }
    ]
  }
);
