import { createProject } from './../projects/project.model';
import {
  getRunById,
  createRun as storageCreateRun,
  setSpecClaimed,
  addSpecsToRun,
} from './run.model';

import { createInstance } from '../instances/instance.controller';
import { getDashboardRunURL } from '@src/lib/urls';

import {
  AppError,
  RUN_EXISTS,
  RUN_NOT_EXIST,
  CLAIM_FAILED,
} from '@src/lib/errors';

import {
  generateRunIdHash,
  generateGroupId,
  generateUUID,
} from '@src/lib/hash';
import {
  ExecutionDriver,
  Task,
  CreateRunWarning,
  CreateRunResponse,
} from '@src/types';
import {
  enhanceSpec,
  getClaimedSpecs,
  getFirstUnclaimedSpec,
  getNewSpecsInGroup,
  getSpecsForGroup,
} from '../../utils';

export const getById = getRunById;

export const createRun: ExecutionDriver['createRun'] = async (params) => {
  const runId = generateRunIdHash(params);
  const groupId =
    params.group ?? generateGroupId(params.platform, params.ciBuildId);

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
    await createProject({
      projectId: params.projectId,
      createdAt: new Date().toISOString(),
    });
    await storageCreateRun({
      runId,
      createdAt: new Date().toISOString(),
      meta: {
        ciBuildId: params.ciBuildId,
        commit: params.commit,
        projectId: params.projectId,
        platform: params.platform,
      },
      specs: params.specs.map(enhaceSpecForThisRun),
    });
    return response;
  } catch (error) {
    if (error.code && error.code === RUN_EXISTS) {
      response.isNewRun = false;
      // update new specs for a new group
      // TODO: prone to race condition on serverless
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
          message: `Group ${groupId} has different specs for the same run. Make sure each group in run has the same specs.`,
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
    });
    return {
      instance: spec,
      claimedInstances: getClaimedSpecs(run, groupId).length + 1,
      totalInstances: getSpecsForGroup(run, groupId).length,
    };
  } catch (error) {
    if (error.code && error.code === CLAIM_FAILED) {
      // just try to get next available spec
      return await getNextTask({ runId, machineId, groupId });
    }
    throw error;
  }
};
