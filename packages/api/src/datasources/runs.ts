import { DataSource } from 'apollo-datasource';
import { init, getMongoDB } from '@src/lib/mongo';

const mergeRunSpecs = run => {
  // merge fullspec into spec
  run.specs = run.specs.map(s => ({
    ...s,
    ...(run.specsFull.find(full => full.instanceId === s.instanceId) || {})
  }));
  return run;
};

const fullRunReducer = fullMongoRun => fullMongoRun.map(mergeRunSpecs);

const matchRunAggregation = (runId: string) => ({
  $match: {
    runId
  }
});

const populateInstancesAggregation = [
  {
    $project: {
      runId: 1,
      meta: 1,
      specs: 1,
      specsFull: {
        $map: {
          input: '$specs',
          as: 'spec',
          in: '$$spec.instanceId'
        }
      }
    }
  },
  {
    $lookup: {
      from: 'instances',
      localField: 'specsFull',
      foreignField: 'instanceId',
      as: 'specsFull'
    }
  }
];
const getFullRuns = async () =>
  await getMongoDB()
    .collection('runs')
    .aggregate(populateInstancesAggregation);

export class RunsAPI extends DataSource {
  async initialize() {
    await init();
  }

  async getAllRuns() {
    const result = await getFullRuns();
    console.log(await result.toArray());
    return fullRunReducer(await result.toArray());
  }

  async getRunById(id: string) {
    const result = await getMongoDB()
      .collection('runs')
      .aggregate([matchRunAggregation(id), ...populateInstancesAggregation]);

    return fullRunReducer(await result.toArray()).pop();
  }
}
