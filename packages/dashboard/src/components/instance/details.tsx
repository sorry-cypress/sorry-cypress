import React from 'react';
import { Test, CorruptedTest } from '../test';

import { useCss } from 'bold-ui';

import { Instance, InstanceTest } from '../../generated/graphql';

const TestItem = ({
  test,
  instanceId,
}: {
  test: InstanceTest | null;
  instanceId: string;
}) => {
  if (!test) {
    return <CorruptedTest />;
  }

  return <Test instanceId={instanceId} test={test} />;
};
export const InstanceDetails: React.FC<{ instance: Instance }> = ({
  instance,
}: {
  instance: Instance;
}) => {
  const { css } = useCss();
  if (!instance.results) {
    return <p>No results yet for the spec</p>;
  }
  const tests = instance.results.tests;

  if (!tests) {
    return <div>No tests reported for spec</div>;
  }

  return (
    <div>
      <strong>Tests</strong>

      <ul>
        {tests.map((t) => (
          <li
            key={(t && t.testId) || ''}
            className={css`
               {
                padding: 12px 0;
              }
            `}
          >
            <TestItem test={t} instanceId={instance.instanceId} />
          </li>
        ))}
      </ul>
    </div>
  );
};
