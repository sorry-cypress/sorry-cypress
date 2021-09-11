import {
  getTestListRetries,
  InstanceResult,
  Run,
  RunSpec,
} from '@sorry-cypress/common';
import {
  AppError,
  CLAIM_FAILED,
  RUN_EXISTS,
  SPEC_COMPLETE_FAILED,
} from '@sorry-cypress/director/lib/errors';
import { getSanitizedMongoObject } from '@sorry-cypress/director/lib/results';
import { ExecutionDriver } from '@sorry-cypress/director/types';
import { getLogger } from '@sorry-cypress/logger';
import { Collection } from '@sorry-cypress/mongo';
import { omit, pick } from 'lodash';

export const getRunById = (id: string) =>
  Collection.run().findOne<Run>({ runId: id });

export const createRun = async (run: Run): Promise<Run> => {
  try {
    const result = await Collection.run().insertOne(
      getSanitizedMongoObject(omit(run, 'meta.platform.osCpus'))
    );
    return result.ops[0];
  } catch (error) {
    if (error.code && error.code === 11000) {
      throw new AppError(RUN_EXISTS);
    }
    throw error;
  }
};

export const addSpecsToRun = async (runId: string, specs: RunSpec[]) => {
  await Collection.run().updateOne(
    { runId },
    {
      $push: { specs: { $each: specs } },
    }
  );
};

export const incProgressOverallTests = async (
  runId: string,
  groupId: string,
  inc: number
) => {
  await Collection.run().updateOne(
    {
      runId,
    },
    {
      $inc: {
        'progress.groups.$[group].tests.overall': inc,
      },
    },
    {
      arrayFilters: [{ 'group.groupId': groupId }],
    }
  );
};

// atomic operation to avoid concurrency issues
// filter document prevents concurrent writes
export const setSpecClaimed = async (
  runId: string,
  groupId: string,
  instanceId: string,
  machineId: string
) => {
  getLogger().log(
    { runId, groupId, instanceId, machineId },
    'Setting spec as claimed'
  );
  const { matchedCount, modifiedCount } = await Collection.run().updateOne(
    {
      runId,
      specs: {
        $elemMatch: {
          instanceId,
          claimedAt: null,
        },
      },
    },
    {
      $currentDate: {
        'progress.updatedAt': true,
      },
      $set: {
        'specs.$[spec].machineId': machineId,
        'specs.$[spec].claimedAt': new Date().toISOString(),
      },
      $inc: {
        'progress.groups.$[group].instances.claimed': 1,
      },
    },
    {
      arrayFilters: [
        { 'spec.instanceId': instanceId },
        { 'group.groupId': groupId },
      ],
    }
  );

  if (matchedCount && modifiedCount) {
    getLogger().log(
      { runId, groupId, instanceId, machineId },
      'Success setting spec as claimed'
    );
    return;
  } else {
    throw new AppError(CLAIM_FAILED);
  }
};

export const setRunCompleted: ExecutionDriver['setRunCompleted'] = async (
  runId
) => {
  Collection.run().updateOne(
    {
      runId,
      completion: {
        completed: false,
      },
    },
    {
      $set: {
        completion: {
          completed: true,
        },
      },
    }
  );
};

export const setRunCompletedWithTimeout: ExecutionDriver['setRunCompletedWithTimeout'] = async ({
  runId,
  timeoutMs,
}) => {
  Collection.run().updateOne(
    {
      runId,
      completion: {
        completed: false,
      },
    },
    {
      $set: {
        completion: {
          completed: true,
          inactivityTimeoutMs: timeoutMs,
        },
      },
    }
  );
};

// atomic operation to avoid concurrency issues
// filter document prevents concurrent writes
export const setSpecCompleted = async (
  runId: string,
  groupId: string,
  instanceId: string,
  instanceResult: InstanceResult
) => {
  const stats = instanceResult.stats;
  const hasFailures = stats.failures > 0 || stats.skipped > 0;
  const retries = getTestListRetries(instanceResult.tests);
  const { matchedCount, modifiedCount } = await Collection.run().updateOne(
    {
      runId,
      specs: {
        $elemMatch: {
          instanceId,
          completedAt: null,
        },
      },
    },
    {
      $currentDate: {
        'progress.updatedAt': true,
        'specs.$[spec].completedAt': true,
      },
      $inc: {
        'progress.groups.$[group].instances.complete': 1,
        'progress.groups.$[group].instances.passes': hasFailures ? 0 : 1,
        'progress.groups.$[group].instances.failures': hasFailures ? 1 : 0,

        'progress.groups.$[group].tests.passes': stats.passes,
        'progress.groups.$[group].tests.failures': stats.failures,
        'progress.groups.$[group].tests.skipped': stats.skipped,
        'progress.groups.$[group].tests.pending': stats.pending,
        'progress.groups.$[group].tests.retries': retries,
      },
      $set: {
        'specs.$[spec].results': {
          ...pick(instanceResult, 'stats', 'error'),
          retries,
        },
      },
    },
    {
      arrayFilters: [
        { 'spec.instanceId': instanceId },
        { 'group.groupId': groupId },
      ],
    }
  );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(SPEC_COMPLETE_FAILED);
  }
};

// track progress for the new group
export const addNewGroupToRun = async (
  runId: string,
  groupId: string,
  specs: RunSpec[]
) => {
  Collection.run().updateOne(
    { runId },
    {
      $push: {
        specs: { $each: specs },
        'progress.groups': getNewGroupTemplate(groupId, specs.length),
      },
    }
  );
};

export const getNewGroupTemplate = (
  groupId: string,
  overallInstances: number
) => ({
  groupId,
  instances: {
    overall: overallInstances,
    claimed: 0,
    complete: 0,
    passes: 0,
    failures: 0,
  },
  tests: {
    overall: 0,
    passes: 0,
    failures: 0,
    skipped: 0,
    pending: 0,
    retries: 0,
  },
});
