import React from 'react';
import { Link } from 'react-router-dom';
import { HFlow } from 'bold-ui';
import { SpecState } from '../common';
import { getSpecState } from '../../lib/spec';
import { FullRunSpec } from '../../generated/graphql';

type SpecSummaryProps = {
  spec: FullRunSpec;
};
export function SpecSummary({ spec }: SpecSummaryProps): React.ReactNode {
  return (
    <HFlow>
      <SpecState state={getSpecState(spec)} />
      <Link to={`/instance/${spec.instanceId}`}>{spec.spec}</Link>{' '}
    </HFlow>
  );
}
