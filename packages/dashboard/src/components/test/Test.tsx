import React from 'react';
import { Link } from 'react-router-dom';
import { TestState } from '../common';

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

export function Test({ instanceId, test }) {
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
