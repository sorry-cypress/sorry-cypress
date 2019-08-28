import { getMongoDB } from '../lib/mongo';
import { AppError, RUN_EXISTS, CLAIM_FAILED } from '../lib/errors';
import { Run } from './run.types';

export const getRunById = async (id: string) =>
  await getMongoDB()
    .collection('runs')
    .findOne({ runId: id });

export const createRun = async (run: Run) => {
  try {
    const { result } = await getMongoDB()
      .collection('runs')
      .insertOne(run);
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
export const setInstanceClaimed = async (runId: string, instanceId: string) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection('runs')
    .updateOne(
      {
        runId,
        specs: {
          $elemMatch: {
            instanceId,
            claimed: false
          }
        }
      },
      {
        $set: { 'specs.$[spec].claimed': true }
      },
      {
        arrayFilters: [{ 'spec.instanceId': instanceId }]
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(CLAIM_FAILED);
  }
};
