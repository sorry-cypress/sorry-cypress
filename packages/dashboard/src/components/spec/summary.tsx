import React from 'react';
import { Link } from 'react-router-dom';

function SpecResultsSummary({ results }) {
  const suiteFailed = results.tests.find(t => t.state !== 'passed');
  return suiteFailed ? '❌' : '✅';
}
export function SpecSummary({ spec }) {
  return (
    <div>
      [{spec.claimed ? 'claimed' : 'unclaimed'}]{' '}
      <Link to={`/instance/${spec.instanceId}`}>{spec.spec}</Link>{' '}
      {spec.results && <SpecResultsSummary results={spec.results} />}
    </div>
  );
}
