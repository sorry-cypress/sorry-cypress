import React from 'react';
import { Link } from 'react-router-dom';
import { InstanceTest } from '@src/generated/graphql';
import { VisualTestState } from '@src/components/common';

export function CorruptedTest() {
  return (
    <div>
      <strong>
        <VisualTestState state={'unknown'} />
      </strong>{' '}
      Cannot read test data
    </div>
  );
}

type TestProps = {
  instanceId: string;
  test: InstanceTest;
};
export function Test({ instanceId, test }: TestProps) {
  return (
    <div>
      <strong>
        <VisualTestState state={test.state} />
      </strong>{' '}
      {test.wallClockDuration && `[${test.wallClockDuration} msec]`}{' '}
      <Link to={`/instance/${instanceId}/test/${test.testId}`}>
        {test.title.join(' > ')}
      </Link>
    </div>
  );
}
