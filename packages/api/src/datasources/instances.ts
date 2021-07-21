import { Instance, Run } from '@sorry-cypress/common';
import { Collection } from '@sorry-cypress/mongo/dist';
import { DataSource } from 'apollo-datasource';
import plur from 'plur';

export class InstancesAPI extends DataSource {
  async getInstanceById(instanceId: string) {
    const response = (await Collection.instance()
      .aggregate([
        {
          $match: { instanceId },
        },
        lookupAggregation,
      ])
      .toArray()) as InstanceWithRuns[];

    return getInstanceReducer(response);
  }

  getResultsByInstanceId(instanceId: string) {
    return Collection.instance().findOne(
      { instanceId },
      { projection: { results: 1 } }
    );
  }

  async deleteInstancesByRunIds(runIds: string[]) {
    const result = await Collection.instance().deleteMany({
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

  async resetInstanceById(instanceId: string) {
    const instance = await Collection.instance().findOne({
      instanceId: instanceId,
    });

    const run = await Collection.run().findOne({
      runId: instance.runId,
    });

    run.specs = run.specs.map((spec) => {
      if (spec.instanceId === instanceId) {
        return {
          ...spec,
          claimedAt: null,
          completedAt: null,
          machineId: null,
        };
      } else {
        return spec;
      }
    });

    await Collection.run().updateOne(
      {
        runId: run.runId,
      },
      {
        $set: {
          specs: run.specs,
          completion: {
            completed: false,
          },
        },
      }
    );

    const result = await Collection.instance().deleteOne({
      instanceId: instanceId,
    });

    return {
      success: result.result.ok === 1,
      message: `${result.deletedCount} ${plur(
        'document',
        result.deletedCount
      )} modified`,
      instanceId: result.result.ok === 1 ? instanceId : undefined,
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
    const response = (await Collection.instance()
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
  const result = instanceWithRuns[0];
  return { ...result, run: result.run[0] };
};

const lookupAggregation = {
  $lookup: {
    from: 'runs',
    localField: 'runId',
    foreignField: 'runId',
    as: 'run',
  },
};
