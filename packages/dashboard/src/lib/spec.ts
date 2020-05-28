export type SpecStateType =
  | 'passed'
  | 'failed'
  | 'pending'
  | 'running'
  | 'notests';
import { FullRunSpec } from '../generated/graphql';

export const getSpecState = (spec: FullRunSpec): SpecStateType => {
  if (spec.claimed && !spec.results) {
    return 'running';
  }

  if (!spec.results) {
    return 'pending';
  }

  if (!spec.results.tests) {
    return 'notests';
  }

  const nonPassedTestsFound = !!spec.results.tests.find(
    (t) => t && t.state === 'failed'
  );
  if (nonPassedTestsFound) {
    return 'failed';
  }
  return 'passed';
};
