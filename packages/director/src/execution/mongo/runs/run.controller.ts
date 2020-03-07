import {
  getRunById,
  createRun as storageCreateRun,
  setSpecClaimed
} from './run.model';

import { createInstance } from '../instances/instance.controller';
import { getDashboardRunURL } from '@src/lib/urls';

import {
  AppError,
  RUN_EXISTS,
  RUN_NOT_EXIST,
  CLAIM_FAILED
} from '@src/lib/errors';

import {
  generateRunIdHash,
  generateGroupId,
  generateUUID
} from '@src/lib/hash';
import { CreateRunParameters, CreateRunResponse, Run, Task } from '@src/types';

export const getById = getRunById;

export const createRun = async (
  params: CreateRunParameters
): Promise<CreateRunResponse> => {
  const runId = generateRunIdHash(params);
  const groupId = generateGroupId(params.platform, params.ciBuildId);

  const response = {
    groupId,
    machineId: generateUUID(),
    runId,
    runUrl: getDashboardRunURL(runId),
    warnings: [] as string[]
  };

  try {
    await storageCreateRun({
      runId,
      createdAt: new Date().toISOString(),
      meta: {
        groupId,
        ciBuildId: params.ciBuildId,
        commit: params.commit,
        projectId: params.projectId,
        platform: params.platform
      },
      specs: params.specs.map(spec => ({
        spec,
        instanceId: generateUUID(),
        claimed: false
      }))
    });
    return response;
  } catch (error) {
    if (error.code && error.code === RUN_EXISTS) {
      return response;
    }
    throw error;
  }
};

const getClaimedSpecs = (run: Run) => run.specs.filter(s => s.claimed);
const getFirstUnclaimedSpec = (run: Run) => run.specs.find(s => !s.claimed);
const getAllSpecs = (run: Run) => run.specs;

export const getNextTask = async (runId: string): Promise<Task> => {
  let run = await getById(runId);
  if (!run) {
    throw new AppError(RUN_NOT_EXIST);
  }
  if (!getFirstUnclaimedSpec(run)) {
    return {
      instance: null,
      claimedInstances: getClaimedSpecs(run).length,
      totalInstances: getAllSpecs(run).length
    };
  }

  const spec = getFirstUnclaimedSpec(run);
  try {
    await setSpecClaimed(runId, spec.instanceId);
    await createInstance({
      runId,
      instanceId: spec.instanceId,
      spec: spec.spec
    });
    return {
      instance: spec,
      claimedInstances: getClaimedSpecs(run).length + 1,
      totalInstances: getAllSpecs(run).length
    };
  } catch (error) {
    if (error.code && error.code === CLAIM_FAILED) {
      return await getNextTask(runId);
    }
    throw error;
  }
};
