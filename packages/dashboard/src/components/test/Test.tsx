import React from 'react';
import { Link } from 'react-router-dom';
import { TestState } from '../common';
import { InstanceTest } from '../../generated/graphql';

export function CorruptedTest() {
  return (
    <div>
      <strong>
        <TestState state={'unknown'} />
      </strong>{' '}
      Cannot read test data
    </div>
  );
}

type TestProps = {
  instanceId: string;
  test: InstanceTest;
};
export function Test({ instanceId, test }: TestProps): React.ReactNode {
  return (
    <div>
      <strong>
        <TestState state={test.state} />
      </strong>{' '}
      {test.wallClockDuration && `[${test.wallClockDuration} msec]`}{' '}
      <Link to={`/instance/${instanceId}/test/${test.testId}`}>
        {test.title.join(' > ')}
      </Link>
    </div>
  );
}
