export type SpecStateType = 'passed' | 'failed' | 'pending';
import { Instance } from '../generated/graphql';

export const getSpecState = (spec: Instance): SpecStateType => {
  if (!spec.results) {
    return 'pending';
  }
  const nonPassedTestsFound = !!spec.results.tests.find(
    (t) => t && t.state === 'failed'
  );
  if (nonPassedTestsFound) {
    return 'failed';
  }
  return 'passed';
};
