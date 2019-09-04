import React from 'react';
export function InstanceSummary({
  instance: {
    results: { stats }
  }
}) {
  return (
    <ul>
      {['suites', 'tests', 'passes', 'pending', 'failures'].map(i => (
        <li key={i}>
          <strong>{i}: </strong> {stats[i]}
        </li>
      ))}
    </ul>
  );
}
