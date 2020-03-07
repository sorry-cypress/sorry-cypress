import { InstanceResult } from '@src/types';
import { getMongoDB } from '@src/lib/mongo';
import {
  AppError,
  INSTANCE_EXISTS,
  VIDEO_URL_UPDATE_FAILED,
  SCREENSHOT_URL_UPDATE_FAILED,
  INSTANCE_RESULTS_UPDATE_FAILED
} from '@src/lib/errors';
import { getSanitizedMongoObject } from '@src/lib/results';

const COLLECTION_NAME = 'instances';

export const insertInstance = async ({
  runId,
  instanceId,
  spec
}: {
  runId: string;
  instanceId: string;
  spec: string;
}) => {
  try {
    await getMongoDB()
      .collection(COLLECTION_NAME)
      .insertOne({
        spec,
        runId,
        instanceId
      });
  } catch (error) {
    if (error.code && error.code === 11000) {
      throw new AppError(INSTANCE_EXISTS);
    }
    throw error;
  }
};

export const getInstanceById = async (instanceId: string) =>
  await getMongoDB()
    .collection(COLLECTION_NAME)
    .findOne({ instanceId });

export const setInstanceResults = async (
  instanceId: string,
  results: InstanceResult
) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        instanceId
      },
      {
        $set: {
          results: getSanitizedMongoObject(results)
        }
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(INSTANCE_RESULTS_UPDATE_FAILED);
  }
};

export const setScreenshotUrl = async (
  instanceId: string,
  screenshotId: string,
  screenshotURL: string
) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        instanceId
      },
      {
        $set: {
          'results.screenshots.$[screenshot].screenshotURL': screenshotURL
        }
      },
      {
        arrayFilters: [{ 'screenshot.screenshotId': screenshotId }]
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(SCREENSHOT_URL_UPDATE_FAILED);
  }
};

export const setvideoUrl = async (instanceId: string, videoUrl: string) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        instanceId
      },
      {
        $set: {
          'results.videoUrl': videoUrl
        }
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(VIDEO_URL_UPDATE_FAILED);
  }
};
