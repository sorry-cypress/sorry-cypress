import { AcUnit as AcUnitIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { blue } from '@mui/material/colors';
import { TestState } from '@sorry-cypress/dashboard/generated/graphql';
import { isIdle } from '@sorry-cypress/dashboard/lib/time';
import React, { FunctionComponent } from 'react';
import { Chip } from '..';

export const getInstanceState: GetInstanceState = (data) => {
  const { claimedAt, retries, stats } = data;

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
    return 'noTests';
  }

  if (retries > 0) {
    return 'flaky';
  }

  return 'passed';
};

export const VisualTestState: VisualTestStateComponent = (props) => {
  const { state, retries = 0 } = props;

  if (retries > 0) {
    return (
      <Tooltip title="Flaky">
        <Chip
          label={
            <>
              Passed{' '}
              <AcUnitIcon sx={{ fontSize: 'inherit', color: blue[400] }} />
            </>
          }
          color="lime"
        ></Chip>
      </Tooltip>
    );
  }

  switch (state) {
    case TestState.Failed:
      return <Chip label="Failed" color="red"></Chip>;
    case TestState.Passed:
      return <Chip label="Passed" color="green"></Chip>;
    case TestState.Pending:
      return <Chip label="Pending" color="grey"></Chip>;
    case TestState.Skipped:
      return <Chip label="Skipped" color="orange"></Chip>;
    default:
      return <Chip label="Unknown" color="yellow"></Chip>;
  }
};

export const SpecStateTag: SpecStateTagComponent = (props) => {
  const { state } = props;

  switch (state) {
    case 'failed':
      return <Chip label="Failed" color="red"></Chip>;
    case 'flaky':
      return (
        <Tooltip title="Flaky">
          <Chip
            label={
              <>
                <span>Passed </span>
                <AcUnitIcon sx={{ fontSize: 'inherit', color: blue[400] }} />
              </>
            }
            color="lime"
          ></Chip>
        </Tooltip>
      );
    case 'passed':
      return <Chip label="Passed" color="green"></Chip>;
    case 'noTests':
      return <Chip label="No Tests" color="blueGrey"></Chip>;
    case 'pending':
      return <Chip label="Pending" color="grey"></Chip>;
    case 'running':
      return <Chip label="Running" color="cyan"></Chip>;
    default:
      return <Chip label="Unknown" color="yellow"></Chip>;
  }
};

export type InstanceState =
  | 'passed'
  | 'failed'
  | 'pending'
  | 'running'
  | 'noTests'
  | 'flaky'
  | 'idle';
type GetInstanceState = (InstanceData: {
  claimedAt: string | null;
  retries: number;
  stats?: {
    failures: number;
    tests: number;
    skipped: number;
  };
}) => InstanceState;

type TestStateProps = {
  state?: TestState | 'unknown';
  retries?: number;
};
type VisualTestStateComponent = FunctionComponent<TestStateProps>;

type SpecStateTagProps = { state: InstanceState };
type SpecStateTagComponent = FunctionComponent<SpecStateTagProps>;
