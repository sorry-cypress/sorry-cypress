import { getTestRetries } from '@sorry-cypress/common';
import { VisualTestState } from '@sorry-cypress/dashboard/components/common';
import { InstanceTest } from '@sorry-cypress/dashboard/generated/graphql';
import React from 'react';
import { Link } from 'react-router-dom';

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
        <VisualTestState
          state={test.state}
          retries={getTestRetries(test.state, test.attempts.length)}
        />
      </strong>{' '}
      <Link to={`/instance/${instanceId}/test/${test.testId}`}>
        {test.title.join(' > ')}
      </Link>
    </div>
  );
}
