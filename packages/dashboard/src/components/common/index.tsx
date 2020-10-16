import { Paper as UIPaper, Tag, useCss, useStyles } from 'bold-ui';
import React, { FC } from 'react';

export const Paper: FC = (props) => {
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
  state?: TestStates | null;
};

export const VisualState = ({ state }: TestStateProps) => {
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
  state: TestStates & 'running';
};

export const SpecState: FC<SpecStateProps> = ({ state }: SpecStateProps) => {
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

export const CenteredContent: FC = ({ children }) => {
  const { css } = useCss();

  return (
    <div
      className={css`
        text-align: center;
        padding: 2rem 1rem;
      `}
    >
      {children}
    </div>
  );
};
