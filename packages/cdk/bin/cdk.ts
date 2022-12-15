import { App } from '@aws-cdk/core';
import 'source-map-support/register';
import { SorryCypress } from '../lib/sorry-cypress';

const app = new App();
const cloudFormationStackName = process.env.GU_CFN_STACK_NAME;
new SorryCypress(app, 'SorryCypress', {
  stack: 'playground',
  cloudFormationStackName,
});
