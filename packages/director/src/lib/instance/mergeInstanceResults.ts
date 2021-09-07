import {
  InstanceResult,
  SetInstanceTestsPayload,
  Test,
  TestState,
  UpdateInstanceResultsPayload,
} from '@sorry-cypress/common';
import { getReporterStatsFromTests, getStatsFromTests } from './reporterStats';

export function mergeInstanceResults(
  createTestsPayload: SetInstanceTestsPayload | null | undefined,
  updateInstanceResults: UpdateInstanceResultsPayload
): InstanceResult {
  // if there's an exception - backfill the failed tests
  if (updateInstanceResults.exception) {
    const failedTests = getTestsForFailedRunner(
      createTestsPayload?.tests ?? null,
      updateInstanceResults.exception
    );
    return {
      ...updateInstanceResults,
      reporterStats: updateInstanceResults.reporterStats
        ? updateInstanceResults.reporterStats
        : getReporterStatsFromTests(failedTests),
      stats: updateInstanceResults.stats ?? getStatsFromTests(failedTests),
      tests: failedTests,
    };
  }

  // Create test payload is missing
  if (!createTestsPayload) {
    const missingTests = getTestResultWithMissingPrecommit(
      updateInstanceResults.tests
    );
    return {
      ...updateInstanceResults,
      reporterStats: updateInstanceResults.reporterStats
        ? updateInstanceResults.reporterStats
        : getReporterStatsFromTests(missingTests),
      stats: updateInstanceResults.stats ?? getStatsFromTests(missingTests),
      tests: missingTests,
    };
  }

  const { config } = createTestsPayload;

  const mergedTests = mergeTests(
    createTestsPayload.tests,
    updateInstanceResults.tests
  );
  const instanceResult: InstanceResult = {
    ...updateInstanceResults,
    cypressConfig: config,
    reporterStats: updateInstanceResults.reporterStats
      ? updateInstanceResults.reporterStats
      : getReporterStatsFromTests(mergedTests),
    stats: updateInstanceResults.stats ?? getStatsFromTests(mergedTests),
    tests: mergedTests,
  };

  return instanceResult;
}

function getTestsForFailedRunner(
  existingTests: SetInstanceTestsPayload['tests'] | null,
  exception: string
): InstanceResult['tests'] {
  if (!existingTests) {
    return [
      {
        body: '',
        hookIds: [],
        state: TestState.Failed,
        title: ['Unknown'],
        testId: 'unknown0',
        displayError: exception,
        attempts: [],
        hooks: [],
        clientId: 'r1',
      },
    ];
  }
  return existingTests.map((t) => ({
    attempts: [],
    hooks: [],
    ...t,
    state: TestState.Failed,
    testId: t.clientId,
    displayError: exception,
  }));
}

function mergeTests(
  existingTests: SetInstanceTestsPayload['tests'] | null,
  testResults: UpdateInstanceResultsPayload['tests']
): Test[] {
  return (testResults ?? []).map((t) => {
    const existingTest = (existingTests ?? []).find(
      (i) => i.clientId === t.clientId
    );
    return {
      body: '',
      hookIds: [],
      title: ['Unknown'],
      hooks: [],
      ...existingTest,
      ...t,
      testId: t.clientId,
    };
  });
}

function getTestResultWithMissingPrecommit(
  tests: UpdateInstanceResultsPayload['tests'] = []
): InstanceResult['tests'] {
  return (tests ?? []).map((t) => {
    return {
      ...t,
      testId: t.clientId,
      title: ['Unknown'],
      config: {
        retries: 0,
      },
      hookIds: [],
      body: '',
      hooks: [],
    };
  });
}
