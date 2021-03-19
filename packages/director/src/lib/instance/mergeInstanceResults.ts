import {
  InstanceResult,
  SetInstanceTestsPayload,
  TestV670,
  UpdateInstanceResultsPayload,
} from '@src/types';

// fetch tokens from stored _createTestsPayload and "updateTestResults"
export const mergeInstanceResults = (
  createTestsPayload: SetInstanceTestsPayload,
  updateInstanceResults: UpdateInstanceResultsPayload
) => {
  const { config, tests } = createTestsPayload;

  const mergedTests = updateInstanceResults.tests.map((t) => {
    const existingTest = (tests as TestV670[]).find(
      (i) => i.clientId === t.clientId
    );
    return { ...existingTest, ...t, testId: t.clientId };
  });

  const instanceResult: InstanceResult = {
    ...updateInstanceResults,
    cypressConfig: config,
    tests: mergedTests,
  };

  return instanceResult;
};
