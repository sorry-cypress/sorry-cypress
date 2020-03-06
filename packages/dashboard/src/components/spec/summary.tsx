import React from 'react';
import { Link } from 'react-router-dom';
import { HFlow } from 'bold-ui';
import {  SpecState } from '../common';
import { getSpecState } from '../../lib/spec';
import {  Instance } from '../../generated/graphql';

export const SpecSummary: React.FC<{ spec: Instance }> = ({ spec }: { spec: Instance}) => {
  return (
    <HFlow>
      <SpecState state={getSpecState(spec)} />
      <Link to={`/instance/${spec.instanceId}`}>{spec.spec}</Link>{' '}
    </HFlow>
  );
};
