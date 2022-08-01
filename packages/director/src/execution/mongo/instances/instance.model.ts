import { InstanceResult, SetInstanceTestsPayload } from '@sorry-cypress/common';
import {
  AppError,
  INSTANCE_EXISTS,
  INSTANCE_RESULTS_UPDATE_FAILED,
  INSTANCE_SET_TESTS_FAILED,
  SCREENSHOT_URL_UPDATE_FAILED,
  VIDEO_URL_UPDATE_FAILED,
} from '@sorry-cypress/director/lib/errors';
import { getSanitizedMongoObject } from '@sorry-cypress/director/lib/results';
import { Collection } from '@sorry-cypress/mongo';

export const insertInstance = async ({
  runId,
  instanceId,
  spec,
  cypressVersion,
  groupId,
  projectId,
}: {
  runId: string;
  instanceId: string;
  projectId: string;
  spec: string;
  groupId: string;
  cypressVersion: string;
}) => {
  try {
    await Collection.instance().insertOne({
      spec,
      runId,
      projectId,
      instanceId,
      cypressVersion,
      groupId,
    });
  } catch (error) {
    if (error.code && error.code === 11000) {
      throw new AppError(INSTANCE_EXISTS);
    }
    throw error;
  }
};

export const getInstanceById = (instanceId: string) =>
  Collection.instance().findOne({ instanceId });

export const setInstanceResults = async (
  instanceId: string,
  results: InstanceResult
) => {
  const { matchedCount, modifiedCount } = await Collection.instance().updateOne(
    {
      instanceId,
    },
    {
      $set: {
        results: {
          ...getSanitizedMongoObject(results),
        },
      },
    }
  );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(INSTANCE_RESULTS_UPDATE_FAILED);
  }
};

export const setInstanceTests = async (
  instanceId: string,
  payload: SetInstanceTestsPayload
) => {
  const { matchedCount, modifiedCount } = await Collection.instance().updateOne(
    {
      instanceId,
    },
    {
      $set: {
        _createTestsPayload: getSanitizedMongoObject(payload),
      },
    }
  );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(INSTANCE_SET_TESTS_FAILED);
  }
};

export const setScreenshotUrl = async (
  instanceId: string,
  screenshotId: string,
  screenshotURL: string
) => {
  const { matchedCount, modifiedCount } = await Collection.instance().updateOne(
    {
      instanceId,
    },
    {
      $set: {
        'results.screenshots.$[screenshot].screenshotURL': screenshotURL,
      },
    },
    {
      arrayFilters: [{ 'screenshot.screenshotId': screenshotId }],
    }
  );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(SCREENSHOT_URL_UPDATE_FAILED);
  }
};

export const setvideoUrl = async (instanceId: string, videoUrl: string) => {
  const { matchedCount, modifiedCount } = await Collection.instance().updateOne(
    {
      instanceId,
    },
    {
      $set: {
        'results.videoUrl': videoUrl,
      },
    }
  );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(VIDEO_URL_UPDATE_FAILED);
  }
};
