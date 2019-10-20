import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'bold-ui';

function SpecResultsSummary({ results }) {
  const suiteFailed = results.tests.find(t => t.state !== 'passed');
  return suiteFailed ? (
    <Tag type="danger">Failure</Tag>
  ) : (
    <Tag type="success">OK</Tag>
  );
}
export function SpecSummary({ spec }) {
  return (
    <div>
      <Tag>{spec.claimed ? 'claimed' : 'unclaimed'}</Tag>
      <Link to={`/instance/${spec.instanceId}`}>{spec.spec}</Link>{' '}
      {spec.results && <SpecResultsSummary results={spec.results} />}
    </div>
  );
}
