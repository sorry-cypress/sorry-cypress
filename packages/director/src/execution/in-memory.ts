import {
  CreateRunParameters,
  CreateRunResponse,
  CreateRunWarning,
  getCreateProjectValue,
  Instance,
  InstanceResult,
  Project,
  Run,
  RunMetaData,
  SetInstanceTestsPayload,
  Task,
  UpdateInstanceResultsPayload,
} from '@sorry-cypress/common';
import { INACTIVITY_TIMEOUT_SECONDS } from '@sorry-cypress/director/config';
import { getRunCiBuildId } from '@sorry-cypress/director/lib/ciBuildId';
import {
  AppError,
  INSTANCE_NOT_EXIST,
  RUN_NOT_EXIST,
} from '@sorry-cypress/director/lib/errors';
import {
  generateGroupId,
  generateRunIdHash,
  generateUUID,
} from '@sorry-cypress/director/lib/hash';
import { mergeInstanceResults } from '@sorry-cypress/director/lib/instance';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { ExecutionDriver } from '@sorry-cypress/director/types';
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
  const ciBuildId = getRunCiBuildId(params);

  const runId = generateRunIdHash(
    ciBuildId,
    params.commit.sha,
    params.projectId
  );

  const machineId = generateUUID();

  const groupId = params.group ?? generateGroupId(params.platform, ciBuildId);
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
      response.warnings?.push({
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

  // @ts-ignore
  runs[runId] = {
    runId,
    createdAt: new Date().toUTCString(),
    completion: {
      completed: false,
    },
    meta: {
      groupId,
      ciBuildId,
      commit: params.commit,
      projectId: params.projectId,
      platform: params.platform,
      ci: params.ci,
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
      projectId: runs[runId].meta.projectId,
      claimedInstances: runs[runId].specs.length,
      totalInstances: runs[runId].specs.length,
    };
  }

  const unclaimedSpecIndex = runs[runId].specs.findIndex(
    (s) => s === unclaimedSpec
  );
  runs[runId].specs[unclaimedSpecIndex].claimedAt = new Date().toISOString();
  instances[unclaimedSpec.instanceId] = {
    _createTestsPayload: undefined,
    projectId: 'some',
    spec: runs[runId].specs[unclaimedSpecIndex].spec,
    runId,
    groupId,
    instanceId: unclaimedSpec.instanceId,
    cypressVersion: '',
  };

  return {
    projectId: runs[runId].meta.projectId,
    instance: unclaimedSpec,
    claimedInstances: getClaimedSpecs(runs[runId], groupId).length + 1,
    totalInstances: getSpecsForGroup(runs[runId], groupId).length,
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

  const instanceResult = mergeInstanceResults(
    instance._createTestsPayload,
    update
  );

  instances[instanceId].results = instanceResult;
  return instances[instanceId];
};

export const driver: ExecutionDriver = {
  id: 'in-memory',
  init: () => Promise.resolve(),
  getProjectById: (projectId: string) => Promise.resolve(projects[projectId]),
  getRunById: (runId: string) => Promise.resolve(runs[runId]),
  maybeSetRunCompleted: async (_runId: string) => true,
  allGroupSpecsCompleted: async () => true,
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
