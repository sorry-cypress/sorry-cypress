import { Collection } from '@sorry-cypress/mongo';
import {
  AppError,
  CLAIM_FAILED,
  RUN_EXISTS,
  SPEC_COMPLETE_FAILED,
} from '@src/lib/errors';
import { getSanitizedMongoObject } from '@src/lib/results';
import { ExecutionDriver, Run, RunSpec, RunWithSpecs } from '@src/types';

const mergeRunSpecs = (run?: RunWithSpecs) => {
  // merge fullspec into spec
  run.specs = run.specs.map((spec: any) =>
    Object.assign(
      {},
      spec,
      run.specsFull.find((full: any) => full.instanceId === spec.instanceId) ||
        {}
    )
  );
  return run;
};

const matchRunAggregation = (runId: string) => ({
  $match: {
    runId,
  },
});

const projectAggregation = {
  $project: {
    _id: 1,
    runId: 1,
    meta: 1,
    specs: 1,
    createdAt: 1,
    completion: 1,
    specsFull: '$specs.instanceId',
  },
};

const lookupAggregation = {
  $lookup: {
    from: 'instances',
    localField: 'specsFull',
    foreignField: 'instanceId',
    as: 'specsFull',
  },
};

export const getRunWithSpecs: ExecutionDriver['getRunWithSpecs'] = async (id) =>
  mergeRunSpecs(
    (
      await Collection.run()
        .aggregate<RunWithSpecs>([
          matchRunAggregation(id),
          projectAggregation,
          lookupAggregation,
        ])
        .toArray()
    ).pop()
  );

export const getRunById = (id: string) =>
  Collection.run().findOne<Run>({ runId: id });

export const createRun = async (run: Run): Promise<Run> => {
  try {
    const result = await Collection.run().insertOne(
      getSanitizedMongoObject(run)
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

// atomic operation to avoid concurrency issues
// filter document prevents concurrent writes
export const setSpecClaimed = async (
  runId: string,
  instanceId: string,
  machineId: string
) => {
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
      $set: {
        'specs.$[spec].machineId': machineId,
        'specs.$[spec].claimedAt': new Date().toISOString(),
      },
    },
    {
      arrayFilters: [{ 'spec.instanceId': instanceId }],
    }
  );

  if (matchedCount && modifiedCount) {
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
export const setSpecCompleted = async (runId: string, instanceId: string) => {
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
      $set: {
        'specs.$[spec].completedAt': new Date(),
      },
    },
    {
      arrayFilters: [{ 'spec.instanceId': instanceId }],
    }
  );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(SPEC_COMPLETE_FAILED);
  }
};
