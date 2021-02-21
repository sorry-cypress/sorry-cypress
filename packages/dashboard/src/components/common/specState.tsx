import React from 'react';
import { Tag } from 'bold-ui';

type SpecStateProps = {
  state: TestStates & 'running';
};

type TestStates = 'failed' | 'passed' | 'pending' | 'skipped' | 'unknown';

type TestStateProps = {
  state?: TestStates | null;
};

export const VisualTestState = ({ state }: TestStateProps) => {
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

export const SpecState = ({ state }: SpecStateProps) => {
  switch (state) {
    case 'failed':
      return <Tag type="danger">Failed</Tag>;
    case 'passed':
      return <Tag type="success">Passed</Tag>;
    case 'pending':
      return <Tag type="normal">Pending</Tag>;
    case 'running':
      return <Tag type="info">Running</Tag>;
    default:
      return <Tag type="normal">Unknown</Tag>;
  }
};
