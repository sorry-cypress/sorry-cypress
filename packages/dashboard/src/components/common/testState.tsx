import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  CheckOutlined as CheckOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  ErrorOutline as ErrorOutlineIcon,
  Flaky as FlakyIcon,
  LoopOutlined,
  ModeStandbyOutlined as ModeStandbyOutlinedIcon,
  NextPlanOutlined as NextPlanOutlinedIcon,
  RedoOutlined as RedoOutlinedIcon,
  SkipNextOutlined as SkipNextOutlinedIcon,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { TestState } from '@sorry-cypress/dashboard/generated/graphql';
import React, { FunctionComponent } from 'react';
import { Chip } from '..';

export const TEST_STATE_ICONS = {
  flaky: FlakyIcon,
  failed: CloseOutlinedIcon,
  passed: CheckOutlinedIcon,
  pending: RedoOutlinedIcon,
  skipped: SkipNextOutlinedIcon,
  unknown: ModeStandbyOutlinedIcon,
};

export const TestAttemptsState: TestAttemptsStateComponent = (props) => {
  const { attempts = 0 } = props;

  return (
    <Tooltip title="Attempts">
      <Chip
        icon={LoopOutlined}
        label={`${attempts} ${attempts > 1 ? 'Attempts' : 'Attempt'}`}
        color="grey"
        shade={600}
      ></Chip>
    </Tooltip>
  );
};

export const FlakyTestBadge: FlakyTestBadgeComponent = () => {
  return (
    <Tooltip title="Flaky test">
      <Chip icon={FlakyIcon} label="Flakey test" color="pink"></Chip>
    </Tooltip>
  );
};

export const VisualTestState: VisualTestStateComponent = (props) => {
  const { state } = props;

  switch (state) {
    case TestState.Failed:
      return (
        <Chip icon={ErrorOutlineIcon} label="Failed test" color="red"></Chip>
      );
    case TestState.Passed:
      return (
        <Chip
          icon={CheckCircleOutlineIcon}
          label="Passed test"
          color="green"
        ></Chip>
      );
    case TestState.Pending:
      return (
        <Chip
          icon={NextPlanOutlinedIcon}
          label="Ignored test"
          color="blueGrey"
        ></Chip>
      );
    case TestState.Skipped:
      return (
        <Chip
          icon={NextPlanOutlinedIcon}
          label="Skipped test"
          color="orange"
        ></Chip>
      );
    default:
      return <Chip label="Unknown status" color="yellow"></Chip>;
  }
};

type TestAttemptsStateProps = {
  attempts: number;
};
type TestAttemptsStateComponent = FunctionComponent<TestAttemptsStateProps>;

type TestStateProps = {
  state?: TestState | 'unknown';
};
type VisualTestStateComponent = FunctionComponent<TestStateProps>;

type FlakyTestBadgeProps = {
  // nothing yet
};
type FlakyTestBadgeComponent = FunctionComponent<FlakyTestBadgeProps>;
