import { INACTIVITY_TIMEOUT_SECONDS } from '@src/config';
import {
  AppError,
  INSTANCE_NOT_EXIST,
  INSTANCE_NO_CREATE_TEST_DTO,
  RUN_NOT_EXIST,
} from '@src/lib/errors';
import {
  generateGroupId,
  generateRunIdHash,
  generateUUID,
} from '@src/lib/hash';
import { mergeInstanceResults } from '@src/lib/instance';
import { getDashboardRunURL } from '@src/lib/urls';
import {
  CreateRunParameters,
  CreateRunResponse,
  CreateRunWarning,
  ExecutionDriver,
  getCreateProjectValue,
  Instance,
  InstanceResult,
  Project,
  Run,
  RunMetaData,
  SetInstanceTestsPayload,
  Task,
  UpdateInstanceResultsPayload,
} from '@src/types';
import {
  enhanceSpec,
  getClaimedSpecs,
  getFirstUnclaimedSpec,
  getNewSpecsInGroup,
  getSpecsForGroup,
} from './utils';

const projects: { [key: string]: Project } = {};
const runs: { [key: string]: Run } = {};
const instances: {
  [key: string]: Instance;
} = {};

const createProject = (project: Project) => {
  projects[project.projectId] = project;
  return project;
};

const createRun: ExecutionDriver['createRun'] = async (
  params: CreateRunParameters
): Promise<CreateRunResponse> => {
  const runId = generateRunIdHash(params);
  const machineId = generateUUID();

  const groupId =
    params.group ?? generateGroupId(params.platform, params.ciBuildId);
  const enhaceSpecForThisRun = enhanceSpec(groupId);

  const response: CreateRunResponse = {
    groupId,
    machineId,
    runId,
    runUrl: getDashboardRunURL(runId),
    isNewRun: true,
    warnings: [] as CreateRunWarning[],
  };

  if (runs[runId]) {
    response.isNewRun = false;
    // update new specs for a new group
    const newSpecs = getNewSpecsInGroup({
      run: runs[runId],
      groupId,
      candidateSpecs: params.specs,
    });
    if (!newSpecs.length) {
      return response;
    }

    const existingGroupSpecs = getSpecsForGroup(runs[runId], groupId);
    if (newSpecs.length && existingGroupSpecs.length) {
      response.warnings.push({
        message: `Group ${groupId} has different specs for the same run. Make sure each group in run has the same specs.`,
        originalSpecs: existingGroupSpecs.map((spec) => spec.spec).join(', '),
        newSpecs: newSpecs.join(','),
      });
      return response;
    }

    runs[runId].specs = [
      ...runs[runId].specs,
      ...newSpecs.map(enhaceSpecForThisRun),
    ];
    return response;
  }

  if (!projects[params.projectId]) {
    createProject(
      getCreateProjectValue(params.projectId, INACTIVITY_TIMEOUT_SECONDS)
    );
  }

  runs[runId] = {
    runId,
    createdAt: new Date().toUTCString(),
    completion: {
      completed: false,
    },
    meta: {
      groupId,
      ciBuildId: params.ciBuildId,
      commit: params.commit,
      projectId: params.projectId,
      platform: params.platform,
    } as RunMetaData,
    specs: params.specs.map(enhaceSpecForThisRun),
  };

  return response;
};

const getNextTask: ExecutionDriver['getNextTask'] = async ({
  runId,
  groupId,
}): Promise<Task> => {
  if (!runs[runId]) {
    throw new AppError(RUN_NOT_EXIST);
  }

  const unclaimedSpec = getFirstUnclaimedSpec(runs[runId], groupId);

  if (!unclaimedSpec) {
    return {
      instance: null,
      claimedInstances: runs[runId].specs.length,
      totalInstances: runs[runId].specs.length,
    };
  }

  const unclaimedSpecIndex = runs[runId].specs.findIndex(
    (s) => s === unclaimedSpec
  );
  runs[runId].specs[unclaimedSpecIndex].claimed = true;
  instances[unclaimedSpec.instanceId] = {
    _createTestsPayload: null,
    runId,
    instanceId: unclaimedSpec.instanceId,
  };

  return {
    instance: unclaimedSpec,
    claimedInstances: getClaimedSpecs(runs[runId], groupId).length + 1,
    totalInstances: getSpecsForGroup(runs[runId], groupId).length,
  };
};

const getRunWithSpecs: ExecutionDriver['getRunWithSpecs'] = async (runId) => {
  return {
    ...runs[runId],
    specsFull: runs[runId].specs.map((spec) => instances[spec.instanceId]),
  };
};

const setInstanceResults = async (
  instanceId: string,
  results: InstanceResult
) => {
  if (!instances[instanceId]) {
    throw new AppError(INSTANCE_NOT_EXIST);
  }
  instances[instanceId] = { ...instances[instanceId], results };
};

const setInstanceTests = async (
  instanceId: string,
  payload: SetInstanceTestsPayload
) => {
  if (!instances[instanceId]) {
    throw new AppError(INSTANCE_NOT_EXIST);
  }
  instances[instanceId] = {
    ...instances[instanceId],
    _createTestsPayload: { ...payload },
  };
};

const updateInstanceResults = async (
  instanceId: string,
  update: UpdateInstanceResultsPayload
) => {
  const instance = instances[instanceId];
  if (!instance) {
    throw new AppError(INSTANCE_NOT_EXIST);
  }

  if (!instance._createTestsPayload) {
    throw new AppError(INSTANCE_NO_CREATE_TEST_DTO);
  }

  const instanceResult = mergeInstanceResults(
    instance._createTestsPayload,
    update
  );

  instances[instanceId].results = instanceResult;
  return instanceResult;
};

export const driver: ExecutionDriver = {
  id: 'in-memory',
  init: () => Promise.resolve(),
  getProjectById: (projectId: string) => Promise.resolve(projects[projectId]),
  getRunById: (runId: string) => Promise.resolve(runs[runId]),
  getRunWithSpecs,
  getInstanceById: (instanceId: string) =>
    Promise.resolve(instances[instanceId]),
  createRun,
  getNextTask,
  setInstanceResults,
  setInstanceTests,
  updateInstanceResults,
  setScreenshotUrl: () => Promise.resolve(),
  setVideoUrl: () => Promise.resolve(),
  setRunCompleted: async (runId) => {
    if (!runs[runId]) {
      throw new AppError(RUN_NOT_EXIST);
    }
    runs[runId].completion = { completed: true };
  },
  setRunCompletedWithTimeout: async ({ runId, timeoutMs }) => {
    if (!runs[runId]) {
      throw new AppError(RUN_NOT_EXIST);
    }
    runs[runId].completion = {
      completed: true,
      inactivityTimeoutMs: timeoutMs,
    };
  },
};
