import { CreateRunParameters } from '@sorry-cypress/common';
import { camelCase, isEmpty } from 'lodash';

// https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/util/ci_provider.js#L133:L133
const ciParams = [
  'CI_BUILD_ID',
  'CI_PIPELINE_ID',
  'APPVEYOR_JOB_ID',
  'BUILD_BUILDID',
  'CODEBUILD_BUILD_ID',
  'BITBUCKET_BUILD_NUMBER',
  'BUILDKITE_JOB_ID',
  'CIRCLE_JOB',
  'BUILD_ID',
  'CF_BUILD_ID',
  'DRONE_JOB_NUMBER',
  'GITHUB_RUN_ID',
  'BUILD_ID',
  'SHIPPABLE_BUILD_ID',
  'BUILD_BUILDID',
  'TRAVIS_BUILD_ID',
].map(camelCase);

export const getRunCiBuildId = (params: CreateRunParameters): string => {
  if (!isEmpty(params.ciBuildId)) {
    return params.ciBuildId;
  }
  for (const paramName of ciParams) {
    if (params.ci.params && !isEmpty(params.ci.params[paramName])) {
      return params.ci.params[paramName];
    }
  }
  return 'sorry-unknown';
};
