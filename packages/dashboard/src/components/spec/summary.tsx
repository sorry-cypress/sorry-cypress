import React from 'react';
import { Link } from 'react-router-dom';

export function SpecSummary({ spec }) {
  return (
    <div>
      [{spec.claimed ? 'claimed' : 'unclaimed'}]{' '}
      <Link to={`/instance/${spec.instanceId}`}>{spec.spec}</Link>
    </div>
  );
}
