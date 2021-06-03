import { InstanceResultStats } from '@sorry-cypress/common/dist/typings';
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
  if (spec.claimedAt && !spec.results) {
    return 'running';
  }

  if (!spec.results) {
    return 'pending';
  }

  if (!spec.results.tests?.length) {
    return 'notests';
  }

  if (!spec.results.stats.failures && !spec.results.stats.skipped) {
    return 'passed';
  }
  return 'failed';
};

export const getInstanceState = (stats: InstanceResultStats): StateType => {
  if (!stats) {
    return 'pending';
  }

  if (!stats.tests) {
    return 'notests';
  }

  if (!stats.failures && !stats.skipped) {
    return 'passed';
  }
  return 'failed';
};

export const SpecStateTag = ({ state }: { state: StateType }) => {
  switch (state) {
    case 'failed':
      return <Tag type="danger">Failed</Tag>;
    case 'passed':
      return <Tag type="success">Passed</Tag>;
    case 'notests':
      return <Tag type="normal">No Tests</Tag>;
    case 'pending':
      return <Tag type="normal">Pending</Tag>;
    case 'running':
      return <Tag type="info">Running</Tag>;

    default:
      return <Tag type="normal">Unknown</Tag>;
  }
};
