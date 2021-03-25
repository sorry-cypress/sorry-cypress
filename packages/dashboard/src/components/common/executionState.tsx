import { RunDetailSpecFragment, TestState } from '@src/generated/graphql';
import { Tag } from 'bold-ui';
import React from 'react';

type TestStateProps = {
  state?: TestState | 'unknown';
};

export const VisualTestState = ({ state }: TestStateProps) => {
  switch (state) {
    case TestState.Failed:
      return <Tag type="danger">Failed</Tag>;
    case TestState.Passed:
      return <Tag type="success">Passed</Tag>;
    case TestState.Pending:
      return <Tag type="normal">Skipped</Tag>;
    case TestState.Skipped:
      return <Tag type="alert">Skipped</Tag>;
    default:
      return <Tag type="normal">Unknown</Tag>;
  }
};

export type StateType = 'passed' | 'failed' | 'pending' | 'running' | 'notests';
export const getSpecState = (spec: RunDetailSpecFragment): StateType => {
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
    (t) => t && t.state === TestState.Failed
  );
  if (nonPassedTestsFound) {
    return 'failed';
  }
  return 'passed';
};

interface InstanceForState {
  results: {
    tests: Array<{
      state: TestState;
    }>;
  } | null;
}
export const getInstanceState = (instance: InstanceForState): StateType => {
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

export const SpecStateTag = ({ state }: { state: StateType }) => {
  switch (state) {
    case 'failed':
      return <Tag type="danger">Failed</Tag>;
    case 'passed':
    case 'notests':
      return <Tag type="success">Passed</Tag>;
    case 'pending':
      return <Tag type="normal">Pending</Tag>;
    case 'running':
      return <Tag type="info">Running</Tag>;

    default:
      return <Tag type="normal">Unknown</Tag>;
  }
};
