import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { SorryCypress } from './sorry-cypress';

describe('The SorryCypress stack', () => {
  it('matches the snapshot', () => {
    const app = new App();
    const stack = new SorryCypress(app, 'SorryCypress', {
      stack: 'playground',
    });
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
