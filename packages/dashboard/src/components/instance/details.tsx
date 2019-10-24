import React from 'react';
import { Test } from '../test';

import { useCss } from 'bold-ui';
import { Instance } from '../../generated/graphql';

export const InstanceDetails: React.FC<{ instance: Instance }> = ({
  instance
}) => {
  const { css } = useCss();
  if (!instance.results) {
    return <p>No results for the instance</p>;
  }
  const tests = instance.results.tests;
  return (
    <div>
      <strong>Tests</strong>
      <ul>
        {tests.map(t => (
          <li
            key={t.testId}
            className={css`
               {
                padding: 12px 0;
              }
            `}
          >
            <Test instanceId={instance.instanceId} test={t} />
          </li>
        ))}
      </ul>
    </div>
  );
};
