import { isIdle } from '@sorry-cypress/dashboard/lib/time';
import React, { FunctionComponent } from 'react';
import { Chip } from '..';

export const INSTANCE_STATE_COLORS = {
  flaky: 'pink',
  failed: 'red',
  passed: 'green',
  pending: 'blueGrey',
  skipped: 'orange',
  unknown: 'yellow',
};

export const getInstanceState: GetInstanceState = (data) => {
  const { claimedAt, stats } = data;

  if (claimedAt && !stats && isIdle(claimedAt)) {
    return 'idle';
  }

  if (claimedAt && !stats) {
    return 'running';
  }

  if (!stats) {
    return 'pending';
  }

  // Keep before "no tests" need to have actual failures to qualify as failed
  // mocha allows you to skip tests on purpose, and cypress (and sorry cypress) should respect this
  if (stats.failures > 0 || stats.skipped > 0) {
    return 'failed';
  }

  if (!stats.tests) {
    return 'noTests';
  }

  return 'passed';
};

export const SpecStateChip: SpecStateChipComponent = (props) => {
  const { state } = props;

  switch (state) {
    case 'failed':
      return <Chip label="Failed" color="red" />;

    case 'passed':
      return <Chip label="Passed" color="green" />;

    case 'noTests':
      return <Chip label="No Tests" color="blueGrey" />;

    case 'pending':
      return <Chip label="Pending" color="grey" />;

    case 'running':
      return <Chip label="Running" color="cyan" />;

    default:
      return <Chip label="Unknown" color="yellow" />;
  }
};

export type InstanceState =
  | 'passed'
  | 'failed'
  | 'pending'
  | 'running'
  | 'noTests'
  | 'idle';

type InstanceData = {
  claimedAt: string | null;
  stats?: {
    failures: number;
    tests: number;
    skipped: number;
  };
};
type GetInstanceState = (InstanceData: InstanceData) => InstanceState;

type SpecStateChipProps = { state: InstanceState };
type SpecStateChipComponent = FunctionComponent<SpecStateChipProps>;
