import { HFlow, Icon, Text, Tooltip } from 'bold-ui';
import React from 'react';

export const TestSuccessBadge = ({ value }: { value: number }) => {
  const color = value ? 'success' : 'disabled';
  return (
    <Text color={color}>
      <Tooltip text="Passed Tests">
        <HFlow alignItems="center" hSpacing={0.5}>
          <Icon icon="checkCircleOutline" size={1} />
          {value}
        </HFlow>
      </Tooltip>
    </Text>
  );
};

export const TestFailureBadge = ({ value }: { value: number }) => {
  const color = value ? 'danger' : 'disabled';
  return (
    <Text color={color}>
      <Tooltip text="Failed Tests">
        <HFlow alignItems="center" hSpacing={0.5}>
          <Icon icon="exclamationTriangleOutline" size={1} />
          {value}
        </HFlow>
      </Tooltip>
    </Text>
  );
};

export const TestRetriesSkippedBadge = ({
  retries,
  skipped,
}: {
  retries: number;
  skipped: number;
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <TestRetriesBadge value={retries} />
      <TestSkippedBadge value={skipped} style={{ paddingLeft: '1rem' }} />
    </div>
  );
};

export const TestSkippedBadge = ({
  value,
  style,
}: {
  value: number;
  style?: any;
}) => {
  const color = value ? 'normal' : 'disabled';
  return (
    <Text color={color} style={style}>
      <Tooltip text="Skipped Tests">
        <HFlow alignItems="center" hSpacing={0.5}>
          <Icon icon="timesOutline" size={1} />
          {value}
        </HFlow>
      </Tooltip>
    </Text>
  );
};

export const TestRetriesBadge = ({ value }: { value: number }) => {
  return (
    <Text color="disabled">
      <Tooltip text="Retried Tests">
        <HFlow alignItems="center" hSpacing={0.5}>
          <Icon icon="exclamationTriangleOutline" size={1} />
          {value}
        </HFlow>
      </Tooltip>
    </Text>
  );
};

export const TestOverallBadge = ({ value }: { value: number }) => {
  return (
    <Text>
      <Tooltip text="Total Tests">
        <HFlow alignItems="center" hSpacing={0.5}>
          <Icon icon="fileWithItensOutline" size={1} />
          {value}
        </HFlow>
      </Tooltip>
    </Text>
  );
};
