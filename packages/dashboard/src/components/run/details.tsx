import React, { useState } from 'react';
import { SpecSummary } from '../spec/summary';
import { useCss, Switch, HFlow } from 'bold-ui';
import { getSpecState } from '../../lib/spec';

export function RunDetails({ run }) {
  const { css } = useCss();
  const { specs } = run;

  const [isPassedHidden, setHidePassedSpecs] = useState(false);

  return (
    <div>
      <HFlow justifyContent="space-between">
        <strong>Spec files</strong>
        <Switch
          label="Hide successful specs"
          onChange={() => setHidePassedSpecs(!isPassedHidden)}
        />
      </HFlow>
      <ul>
        {specs
          .filter(spec =>
            isPassedHidden ? getSpecState(spec) !== 'passed' : true
          )
          .map(spec => (
            <li
              key={spec.instanceId}
              className={css`
                 {
                  padding: 12px 0;
                }
              `}
            >
              <SpecSummary spec={spec} />
            </li>
          ))}
      </ul>
    </div>
  );
}
