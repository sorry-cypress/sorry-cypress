import { Collection } from '@sorry-cypress/mongo';
import { DataSource } from 'apollo-datasource';
import { findIndex } from 'lodash';
import { RunSpec } from '../generated/graphql';

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

    let runSpec: RunSpec | null;
    run.specs = run.specs.map((spec) => {
      if (spec.instanceId === instanceId) {
        runSpec = spec;
        return {
          ...spec,
          claimedAt: null,
          completedAt: null,
          machineId: undefined,
          results: undefined,
        };
      } else {
        return spec;
      }
    });

    const groupId = instance.groupId;
    const groupIndex = findIndex(run.progress.groups, { groupId });
    const groupPath = `progress.groups.${groupIndex}`;
    const stats = runSpec!.results?.stats;
    const flaky = runSpec!.results?.flaky ?? 0;
    const specFailed = stats?.failures && stats.failures > 0;

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
        $inc: {
          [`${groupPath}.instances.claimed`]: -1,
          [`${groupPath}.instances.complete`]: -1,
          [`${groupPath}.instances.passes`]: -(specFailed ? 0 : 1),
          [`${groupPath}.instances.failures`]: -(specFailed ? 1 : 0),
          [`${groupPath}.tests.overall`]: -(stats?.tests || 0),
          [`${groupPath}.tests.passes`]: -(stats?.passes || 0),
          [`${groupPath}.tests.failures`]: -(stats?.failures || 0),
          [`${groupPath}.tests.skipped`]: -(stats?.skipped || 0),
          [`${groupPath}.tests.pending`]: -(stats?.pending || 0),
          [`${groupPath}.tests.flaky`]: -(flaky || 0),
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
}
