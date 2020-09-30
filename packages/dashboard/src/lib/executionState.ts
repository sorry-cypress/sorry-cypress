export type StateType = 'passed' | 'failed' | 'pending' | 'running' | 'notests';
import { FullRunSpec, Instance } from '../generated/graphql';

interface InstanceState {
  results: Instance['results'];
}
export const getInstanceState = (instance: InstanceState): StateType => {
  if (!instance.results) {
    return 'running';
  }

  if (!instance.results) {
    return 'pending';
  }

  if (!instance.results.tests) {
    return 'notests';
  }

  const nonPassedTestsFound = !!instance.results.tests.find(
    (t) => t && t.state === 'failed'
  );
  if (nonPassedTestsFound) {
    return 'failed';
  }
  return 'passed';
};

export const getFullRunSpecState = (run: FullRunSpec): StateType => {
  if (run.claimed && !run.results) {
    return 'running';
  }

  if (!run.results) {
    return 'pending';
  }

  if (!run.results.tests) {
    return 'notests';
  }

  const nonPassedTestsFound = !!run.results.tests.find(
    (t) => t && t.state === 'failed'
  );
  if (nonPassedTestsFound) {
    return 'failed';
  }
  return 'passed';
};
