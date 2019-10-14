import React from 'react';
import { SpecSummary } from '../spec/summary';

export function RunDetails({ run }) {
  const { specs } = run;

  return (
    <div>
      <strong>Test suites:</strong>
      <ul>
        {specs.map(spec => (
          <li key={spec.instanceId}>
            <SpecSummary spec={spec} />
          </li>
        ))}
      </ul>
    </div>
  );
}
