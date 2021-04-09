import { INACTIVITY_TIMEOUT_SECONDS } from '@src/config';
import { getRunCiBuildId } from '@src/lib/ciBuildId';
import {
  AppError,
  CLAIM_FAILED,
  RUN_EXISTS,
  RUN_NOT_EXIST,
} from '@src/lib/errors';
import {
  generateGroupId,
  generateRunIdHash,
  generateUUID,
} from '@src/lib/hash';
import { getDashboardRunURL } from '@src/lib/urls';
import {
  CreateRunResponse,
  CreateRunWarning,
  ExecutionDriver,
  getCreateProjectValue,
  Task,
} from '@src/types';
import {
  enhanceSpec,
  getClaimedSpecs,
  getFirstUnclaimedSpec,
  getNewSpecsInGroup,
  getSpecsForGroup,
} from '../../utils';
import { createInstance } from '../instances/instance.controller';
import { createProject } from './../projects/project.model';
import {
  addSpecsToRun,
  createRun as storageCreateRun,
  getRunById,
  setSpecClaimed,
} from './run.model';

export const getById = getRunById;

export const createRun: ExecutionDriver['createRun'] = async (params) => {
  const ciBuildId = getRunCiBuildId(params);

  const runId = generateRunIdHash(
    ciBuildId,
    params.commit.sha,
    params.projectId
  );

  const groupId = params.group ?? generateGroupId(params.platform, ciBuildId);

  const machineId = generateUUID();
  const enhaceSpecForThisRun = enhanceSpec(groupId);

  const response: CreateRunResponse = {
    groupId,
    machineId,
    runId,
    runUrl: getDashboardRunURL(runId),
    isNewRun: true,
    warnings: [] as CreateRunWarning[],
  };

  try {
    await createProject(
      getCreateProjectValue(params.projectId, INACTIVITY_TIMEOUT_SECONDS)
    );
    await storageCreateRun({
      runId,
      cypressVersion: params.cypressVersion,
      createdAt: new Date().toISOString(),
      completion: {
        completed: false,
      },
      meta: {
        ciBuildId,
        commit: params.commit,
        projectId: params.projectId,
        platform: params.platform,
        ci: params.ci,
      },
      specs: params.specs.map(enhaceSpecForThisRun),
    });
    return response;
  } catch (error) {
    if (error.code && error.code === RUN_EXISTS) {
      response.isNewRun = false;
      // serverless: prone to race condition on serverless
      const run = await getRunById(runId);

      const newSpecs = getNewSpecsInGroup({
        run,
        groupId,
        candidateSpecs: params.specs,
      });

      if (!newSpecs.length) {
        return response;
      }

      // if the same group has different specs - no-no-no!
      const existingGroupSpecs = getSpecsForGroup(run, groupId);
      if (newSpecs.length && existingGroupSpecs.length) {
        response.warnings.push({
          message: `Group ${groupId} has different specs for the same run.`,
          originalSpecs: existingGroupSpecs.map((spec) => spec.spec).join(', '),
          newSpecs: newSpecs.join(','),
        });
        return response;
      }

      await addSpecsToRun(runId, newSpecs.map(enhaceSpecForThisRun));

      return response;
    }
    throw error;
  }
};

export const getNextTask: ExecutionDriver['getNextTask'] = async ({
  runId,
  groupId,
  machineId,
  cypressVersion,
}): Promise<Task> => {
  const run = await getById(runId);
  if (!run) {
    throw new AppError(RUN_NOT_EXIST);
  }

  // all specs claimed
  if (!getFirstUnclaimedSpec(run, groupId)) {
    return {
      instance: null,
      claimedInstances: getClaimedSpecs(run, runId).length,
      totalInstances: getSpecsForGroup(run, groupId).length,
    };
  }

  const spec = getFirstUnclaimedSpec(run, groupId);
  try {
    await setSpecClaimed(runId, spec.instanceId, machineId);
    await createInstance({
      runId,
      instanceId: spec.instanceId,
      spec: spec.spec,
      cypressVersion,
    });
    return {
      instance: spec,
      claimedInstances: getClaimedSpecs(run, groupId).length + 1,
      totalInstances: getSpecsForGroup(run, groupId).length,
    };
  } catch (error) {
    if (error.code && error.code === CLAIM_FAILED) {
      // just try to get next available spec
      return await getNextTask({ runId, machineId, groupId, cypressVersion });
    }
    throw error;
  }
};
