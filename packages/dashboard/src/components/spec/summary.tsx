import React from 'react';
import { Link } from 'react-router-dom';
import { HFlow } from 'bold-ui';
import { SpecState } from '../common';
import { getSpecState } from '../../lib/spec';
import { Maybe, FullRunSpec } from '../../generated/graphql';

type SpecSummaryProps = {
  spec: Maybe<FullRunSpec>;
};
export function SpecSummary({ spec }: SpecSummaryProps) {
  if (!spec) {
    return null;
  }
  return (
    <HFlow>
      <SpecState state={getSpecState(spec)} />
      {spec.claimed ? (
        <Link to={`/instance/${spec.instanceId}`}>{spec.spec}</Link>
      ) : (
        spec.spec
      )}
    </HFlow>
  );
}
