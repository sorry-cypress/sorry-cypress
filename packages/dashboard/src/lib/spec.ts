export type SpecStateType = 'passed' | 'failed' | 'pending';

export const getSpecState = (spec): SpecStateType => {
  if (!spec.results) {
    return 'pending';
  }
  const nonPassedTestsFound = !!spec.results.tests.find(
    t => t.state === 'failed'
  );
  if (nonPassedTestsFound) {
    return 'failed';
  }
  return 'passed';
};
