import { VisualTestState } from '@src/components/common';
import { InstanceScreeshot, InstanceTest } from '@src/generated/graphql';
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
        <VisualTestState state={test.state} />
        <Heading level={1}>{title}</Heading>
      </HFlow>
      <hr />
      <TestDetailsV5 test={test} screenshots={screenshots} />
    </>
  );
}
