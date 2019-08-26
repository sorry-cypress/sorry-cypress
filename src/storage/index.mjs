import { getMongoDB } from './mongo.mjs';
import { AppError, RUN_EXISTS, CLAIM_FAILED } from '../lib/errors.mjs';

export const getRunById = async id =>
  await getMongoDB()
    .collection('runs')
    .findOne({ runId: id });

export const createRun = async run => {
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
export const setInstanceClaimed = async (runId, instanceId) => {
  const { acknowledged, matchedCount, modifiedCount } = await getMongoDB()
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

  console.log({ acknowledged, matchedCount, modifiedCount });
  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(CLAIM_FAILED);
  }
};
