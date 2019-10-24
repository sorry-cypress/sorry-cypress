import React from 'react';
import { Link } from 'react-router-dom';
import { HFlow } from 'bold-ui';
import { TestState } from '../common';
import { getSpecState } from '../../lib/spec';
import { FullRunSpec } from '../../generated/graphql';

export const SpecSummary: React.FC<{ spec: FullRunSpec }> = ({ spec }) => {
  console.log(spec);
  return (
    <HFlow>
      <TestState state={getSpecState(spec)} />
      <Link to={`/instance/${spec.instanceId}`}>{spec.spec}</Link>{' '}
    </HFlow>
  );
};
