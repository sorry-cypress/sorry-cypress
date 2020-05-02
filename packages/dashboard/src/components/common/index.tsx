import React from 'react';
import { Paper as UIPaper, useStyles, Tag } from 'bold-ui';
import { SpecStateType } from '../../lib/spec';

export const Paper: React.FC = (props) => {
  const { css } = useStyles();
  return (
    <UIPaper
      style={css`
         {
          margin: 12px 0;
          padding: 12px;
        }
      `}
      {...props}
    />
  );
};

type TestStates = 'failed' | 'passed' | 'pending' | 'skipped' | 'unknown';

type TestStateProps = {
  state: TestStates;
};
export const TestState: React.FC<TestStateProps> = ({
  state,
}: TestStateProps) => {
  switch (state) {
    case 'failed':
      return <Tag type="danger">Failed</Tag>;
    case 'passed':
      return <Tag type="success">Passed</Tag>;
    case 'pending':
      return <Tag type="normal">Skipped</Tag>;
    case 'skipped':
      return <Tag type="alert">Skipped</Tag>;
    default:
      return <Tag type="normal">Unknown</Tag>;
  }
};

type SpecStateProps = {
  state: SpecStateType;
};

export const SpecState: React.FC<SpecStateProps> = ({
  state,
}: SpecStateProps) => {
  switch (state) {
    case 'failed':
      return <Tag type="danger">Failed</Tag>;
    case 'passed':
      return <Tag type="success">Passed</Tag>;
    case 'pending':
      return <Tag type="normal">Pending</Tag>;
    default:
      return <Tag type="normal">Unknown</Tag>;
  }
};
