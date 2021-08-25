import { Collection } from '@sorry-cypress/mongo/dist';
import { DataSource } from 'apollo-datasource';
import plur from 'plur';

export class InstancesAPI extends DataSource {
  getInstanceById(instanceId: string) {
    return Collection.instance().findOne({ instanceId });
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
    const response = await Collection.instance()
      .aggregate([
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

    const runIds = response.map((x) => x.runId) as string[];
    return await this.deleteInstancesByRunIds(runIds);
  }
}
