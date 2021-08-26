import { getTestRetries } from '@sorry-cypress/common';
import { VisualTestState } from '@sorry-cypress/dashboard/components/common';
import {
  InstanceScreeshot,
  InstanceTest,
} from '@sorry-cypress/dashboard/generated/graphql';
import { Heading, HFlow } from 'bold-ui';
import React from 'react';
import { TestDetailsV5 } from './testDetailsV5';

type TestDetailsProps = {
  test: InstanceTest;
  screenshots: Partial<InstanceScreeshot>[];
};
export function TestDetails({ test, screenshots }: TestDetailsProps) {
  const title = test.title?.join(' > ');

  return (
    <>
      <HFlow>
        <VisualTestState
          state={test.state}
          retries={getTestRetries(test.state, test.attempts.length)}
        />
        <Heading level={1}>{title}</Heading>
      </HFlow>
      <hr />
      <TestDetailsV5 test={test} screenshots={screenshots} />
    </>
  );
}
