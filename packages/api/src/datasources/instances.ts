import { Collection } from '@sorry-cypress/mongo';
import { DataSource } from 'apollo-datasource';

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
      message: `Deleted ${result?.deletedCount ?? 0} item(s)`,
      runIds: result.result.ok === 1 ? runIds : [],
    };
  }

  async resetInstanceById(instanceId: string) {
    const instance = await Collection.instance().findOne({
      instanceId: instanceId,
    });

    if (!instance) {
      return {
        success: false,
        message: `Instance not found`,
      };
    }
    const run = await Collection.run().findOne({
      runId: instance.runId,
    });

    if (!run) {
      return {
        success: false,
        message: `Run not found`,
      };
    }

    run.specs = run.specs.map((spec) => {
      if (spec.instanceId === instanceId) {
        return {
          ...spec,
          claimedAt: null,
          completedAt: null,
          machineId: undefined,
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
      message: `Modifies ${result?.deletedCount ?? 0} item(s)`,
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
