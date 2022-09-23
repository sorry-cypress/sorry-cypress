import {
  InstanceResult,
  isTestFlaky,
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
import { findIndex, omit, pick } from 'lodash';

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

export const addNewJobToRun = async (runId: string, newJobName: string) => {
  await Collection.run().updateOne(
    { runId },
    {
      $push: { 'meta.ci.params.ciJobName': newJobName },
    }
  );
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
  instanceId: string,
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
  // store the number of tests indicated when testing starts
  await Collection.run().updateOne(
    {
      runId,
    },
    {
      $set: {
        'specs.$[specs].tests': inc,
      },
    },
    {
      arrayFilters: [{ 'specs.instanceId': instanceId }],
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
  const flakyTests = instanceResult.tests.filter(isTestFlaky);

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
        'progress.groups.$[group].tests.flaky': flakyTests.length,
      },
      $set: {
        'specs.$[spec].results': {
          ...pick(instanceResult, 'stats', 'error'),
          flaky: flakyTests.length,
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

export const resetFailedSpecs = async (
  run: Run,
  groupId: string,
  specs: RunSpec[]
) => {
  const groupIndex = findIndex(run.progress.groups, { groupId });
  const groupPath = `progress.groups.${groupIndex}`;

  const failedInstanceIds = specs.map((s) => s.instanceId);

  // Create new specs for the run with the failed specs reset
  run.specs = run.specs.map((spec) => {
    if (failedInstanceIds.includes(spec.instanceId)) {
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

  await Collection.run().updateOne(
    {
      runId: run.runId,
    },
    {
      $set: {
        specs: run.specs,
        'comletion.completed': false,
      },
      $inc: {
        [`${groupPath}.instances.claimed`]: -1,
        [`${groupPath}.instances.complete`]: -1,
        [`${groupPath}.instances.failures`]: -1,
        [`${groupPath}.tests.overall`]: -specs.reduce(
          (t, s) => t + (s.results?.stats.tests ?? 0),
          0
        ),
        [`${groupPath}.tests.passes`]: -specs.reduce(
          (t, s) => t + (s.results?.stats.passes ?? 0),
          0
        ),
        [`${groupPath}.tests.failures`]: -specs.reduce(
          (t, s) => t + (s.results?.stats.failures ?? 0),
          0
        ),
        [`${groupPath}.tests.skipped`]: -specs.reduce(
          (t, s) => t + (s.results?.stats.skipped ?? 0),
          0
        ),
        [`${groupPath}.tests.pending`]: -specs.reduce(
          (t, s) => t + (s.results?.stats.pending ?? 0),
          0
        ),
      },
    }
  );
  // Remove failed instances
  await Collection.instance().deleteMany({
    instanceId: { $in: failedInstanceIds },
  });
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
    flaky: 0,
  },
});
