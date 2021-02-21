import { VisualTestState } from '@src/components/common';
import {
  InstanceScreeshot,
  InstanceTest,
  InstanceTestUnion,
  InstanceTestV5,
} from '@src/generated/graphql';
import { isTestGteV5 } from '@src/lib/version';
import { Heading, HFlow } from 'bold-ui';
import React from 'react';
import { Screenshot, TestError } from './common';
import { TestDetailsV5 } from './textDetailsV5';

const TestDetailsLegacy = ({
  test,
  screenshots,
}: {
  test: InstanceTest;
  screenshots: Partial<InstanceScreeshot>[];
}) => {
  const screenshot = screenshots.pop();
  return (
    <>
      {test.wallClockDuration && (
        <ul>
          <li>
            <span>Wall clock duration:</span> {test.wallClockDuration} msec
          </li>
        </ul>
      )}
      {test.error && <TestError error={test.error} stack={test.stack} />}

      {screenshot && <Screenshot screenshot={screenshot} />}
    </>
  );
};

type TestDetailsProps = {
  test: InstanceTestUnion;
  screenshots: Partial<InstanceScreeshot>[];
};
export function TestDetails({ test, screenshots }: TestDetailsProps) {
  const title = test.title?.join(' > ');
  let content: React.ReactNode | null = null;
  if (isTestGteV5(test as InstanceTestV5)) {
    content = (
      <TestDetailsV5 test={test as InstanceTestV5} screenshots={screenshots} />
    );
  } else {
    content = (
      <TestDetailsLegacy
        test={test as InstanceTest}
        screenshots={screenshots}
      />
    );
  }
  return (
    <>
      <HFlow>
        <VisualTestState state={test.state} />
        <Heading level={1}>{title}</Heading>
      </HFlow>
      <hr />
      {content}
    </>
  );
}
