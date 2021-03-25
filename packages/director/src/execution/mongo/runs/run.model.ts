import { AppError, CLAIM_FAILED, RUN_EXISTS } from '@src/lib/errors';
import { getMongoDB } from '@src/lib/mongo';
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
    specsFull: {
      $map: {
        input: '$specs',
        as: 'spec',
        in: '$$spec.instanceId',
      },
    },
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
      await getMongoDB()
        .collection('runs')
        .aggregate([
          matchRunAggregation(id),
          projectAggregation,
          lookupAggregation,
        ])
        .toArray()
    ).pop()
  );

export const getRunById = async (id: string) =>
  await getMongoDB().collection('runs').findOne<Run>({ runId: id });

export const createRun = async (run: Run) => {
  try {
    const result = await getMongoDB()
      .collection('runs')
      .insertOne(getSanitizedMongoObject(run));
    return result.ops[0];
  } catch (error) {
    if (error.code && error.code === 11000) {
      throw new AppError(RUN_EXISTS);
    }
    throw error;
  }
};

export const addSpecsToRun = async (runId: string, specs: RunSpec[]) => {
  await getMongoDB()
    .collection('runs')
    .updateOne(
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
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection('runs')
    .updateOne(
      {
        runId,
        specs: {
          $elemMatch: {
            instanceId,
            claimed: false,
          },
        },
      },
      {
        $set: {
          'specs.$[spec].machineId': machineId,
          'specs.$[spec].claimed': true,
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
  getMongoDB()
    .collection('runs')
    .updateOne(
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
  getMongoDB()
    .collection('runs')
    .updateOne(
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
