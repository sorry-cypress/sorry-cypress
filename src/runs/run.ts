import md5 from 'md5';
import uuid from 'uuid/v4';
import {
  getRunById,
  createRun as storageCreateRun,
  setInstanceClaimed as storageSetInstanceClaimed
} from '../storage';
import {
  AppError,
  RUN_EXISTS,
  RUN_NOT_EXIST,
  CLAIM_FAILED
} from '../lib/errors';

export const getById = getRunById;

interface CommitData {
  sha: string;
}
interface PlatformData {
  osName: string;
  osVersion: string;
}
export interface CreateRunParameters {
  ciBuildId: string;
  commit: CommitData;
  projectId: string;
  specs: string[];
  platform: PlatformData;
}

export interface CreateRunResponse {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  warnings?: string[];
}

interface RunMetaData {
  groupId: string;
  ciBuildId: string;
  commit: CommitData;
  projectId: string;
  platform: PlatformData;
}
export interface RunSpec {
  spec: string;
  instanceId: string;
  claimed: boolean;
}
export interface Run {
  runId: string;
  meta: RunMetaData;
  specs: RunSpec[];
}
export const createRun = async ({
  ciBuildId,
  commit,
  projectId,
  specs,
  platform
}: CreateRunParameters): Promise<CreateRunResponse> => {
  const runId = md5(ciBuildId + commit.sha + projectId + specs.join(' '));
  // not sure how specific that should be
  const groupId = `${platform.osName}-${platform.osVersion}-${ciBuildId}`;

  const response = {
    groupId,
    machineId: uuid(),
    runId,
    runUrl: 'https://sorry.cypress.io/',
    warnings: [] as string[]
  };

  try {
    const newRun = {
      runId,
      meta: {
        groupId,
        ciBuildId,
        commit,
        projectId,
        platform
      },
      specs: specs.map(spec => ({
        spec,
        instanceId: uuid(),
        claimed: false
      }))
    };

    await storageCreateRun(newRun);
    return response;
  } catch (error) {
    if (error.code && error.code === RUN_EXISTS) {
      return response;
    }
    throw error;
  }
};

export const getClaimedInstances = (run: Run) =>
  run.specs.filter(s => s.claimed);
export const getFirstUnclaimedInstance = (run: Run) =>
  run.specs.find(s => !s.claimed);
export const getAllInstances = (run: Run) => run.specs;

export interface Task {
  instance: RunSpec | null;
  claimedInstances: number;
  totalInstances: number;
}
export const getNextTask = async (runId: string): Promise<Task> => {
  let run = await getById(runId);
  if (!run) {
    throw new AppError(RUN_NOT_EXIST);
  }
  if (!getFirstUnclaimedInstance(run)) {
    return {
      instance: null,
      claimedInstances: getClaimedInstances(run).length,
      totalInstances: getAllInstances(run).length
    };
  }

  const instance = getFirstUnclaimedInstance(run);
  try {
    await storageSetInstanceClaimed(runId, instance.instanceId);
    return {
      instance,
      claimedInstances: getClaimedInstances(run).length + 1,
      totalInstances: getAllInstances(run).length
    };
  } catch (error) {
    if (error.code && error.code === CLAIM_FAILED) {
      return await getNextTask(runId);
    }
    throw error;
  }
};
