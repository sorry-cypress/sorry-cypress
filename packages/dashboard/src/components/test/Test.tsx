import React from 'react';
import { Link } from 'react-router-dom';
import { InstanceTest } from '../../generated/graphql';
import { VisualState } from '../common';

export function CorruptedTest() {
  return (
    <div>
      <strong>
        <VisualState state={'unknown'} />
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
        <VisualState state={test.state} />
      </strong>{' '}
      {test.wallClockDuration && `[${test.wallClockDuration} msec]`}{' '}
      <Link to={`/instance/${instanceId}/test/${test.testId}`}>
        {test.title.join(' > ')}
      </Link>
    </div>
  );
}
