export type SpecState = 'passed' | 'failed' | 'pending';
export const getSpecState = spec => {
  if (!spec.results) {
    return 'pending';
  }
  const nonPassedTestsFound = !!spec.results.tests.find(
    t => t.state !== 'passed'
  );
  if (nonPassedTestsFound) {
    return 'failed';
  }
  return 'passed';
};
