import { Run } from '@src/types';
import { getMongoDB } from '@src/lib/mongo';
import { AppError, RUN_EXISTS, CLAIM_FAILED } from '@src/lib/errors';
import { getSanitizedMongoObject } from '@src/lib/results';

export const getRunById = async (id: string) =>
  await getMongoDB().collection('runs').findOne({ runId: id });

export const createRun = async (run: Run) => {
  try {
    const { result } = await getMongoDB()
      .collection('runs')
      .insertOne(getSanitizedMongoObject(run));
    return result;
  } catch (error) {
    if (error.code && error.code === 11000) {
      throw new AppError(RUN_EXISTS);
    }
    throw error;
  }
};

// atomic operation to avoid concurrency issues
// filter document prevents concurrent writes
export const setSpecClaimed = async (runId: string, instanceId: string) => {
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
