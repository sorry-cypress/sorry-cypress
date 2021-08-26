import { getTestListRetries } from '@sorry-cypress/common';
import {
  GetInstanceQuery,
  RunDetailSpecFragment,
  TestState,
} from '@sorry-cypress/dashboard/generated/graphql';
import { Tag } from 'bold-ui';
import React from 'react';

type TestStateProps = {
  state?: TestState | 'unknown';
  retries?: number;
};

export const VisualTestState = ({ state, retries = 0 }: TestStateProps) => {
  if (retries > 0) {
    return <Tag type="alert">Flaky</Tag>;
  }
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

export type StateType =
  | 'passed'
  | 'failed'
  | 'pending'
  | 'running'
  | 'notests'
  | 'flaky';
export const getSpecState = (spec: RunDetailSpecFragment): StateType => {
  if (spec.claimedAt && !spec.results) {
    return 'running';
  }

  if (!spec.results) {
    return 'pending';
  }

  if (!spec.results.stats?.tests) {
    return 'notests';
  }

  if (spec.results.retries ?? 0 > 0) {
    return 'flaky';
  }
  if (!spec.results.stats.failures && !spec.results.stats.skipped) {
    return 'passed';
  }

  return 'failed';
};

export const getInstanceState = (
  instance: GetInstanceQuery['instance']
): StateType => {
  if (!instance?.results?.stats) {
    return 'pending';
  }

  if (!instance.results.tests) {
    return 'notests';
  }

  if (getTestListRetries(instance.results.tests) > 0) {
    return 'flaky';
  }

  if (!instance.results.stats.failures && !instance.results.stats.skipped) {
    return 'passed';
  }
  return 'failed';
};

export const SpecStateTag = ({ state }: { state: StateType }) => {
  switch (state) {
    case 'failed':
      return <Tag type="danger">Failed</Tag>;
    case 'flaky':
      return <Tag type="alert">Flaky</Tag>;
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
