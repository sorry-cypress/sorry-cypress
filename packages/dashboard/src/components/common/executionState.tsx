import { TestState } from '@sorry-cypress/dashboard/generated/graphql';
import { isIdle } from '@sorry-cypress/dashboard/lib/time';
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

export type InstanceState =
  | 'passed'
  | 'failed'
  | 'pending'
  | 'running'
  | 'notests'
  | 'flaky'
  | 'idle';

export const getInstanceState = ({
  claimedAt,
  retries,
  stats,
}: {
  claimedAt: string | null;
  retries: number;
  stats?: {
    failures: number;
    tests: number;
    skipped: number;
  };
}): InstanceState => {
  if (claimedAt && !stats && isIdle(claimedAt)) {
    return 'idle';
  }

  if (claimedAt && !stats) {
    return 'running';
  }

  if (!stats) {
    return 'pending';
  }
  // Keep before "no tests"
  if (stats.failures > 0 || stats.skipped > 0) {
    return 'failed';
  }

  if (!stats.tests) {
    return 'notests';
  }

  if (retries > 0) {
    return 'flaky';
  }

  return 'passed';
};

export const SpecStateTag = ({ state }: { state: InstanceState }) => {
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
