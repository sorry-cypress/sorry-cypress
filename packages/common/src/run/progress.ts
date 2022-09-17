import { ArrayItemType } from '@sorry-cypress/common';
import { differenceInSeconds } from 'date-fns';
import { property, sum } from 'lodash';
import { RunGroupProgress } from './types';

// explicit type due to inconsistency between
// gql and ts types
type Group = {
  groupId: string;
  instances: {
    overall: number;
    claimed: number;
    complete: number;
  };
  tests: TestResults;
};

type TestResults = {
  overall: number;
  passes: number;
  failures: number;
  pending: number;
  skipped: number;
  flaky: number;
};

export const getRunOverallSpecsCount = (progress: { groups: Group[] }) =>
  sum(progress.groups.map(property('instances.overall')));

export const getRunClaimedSpecsCount = (progress: { groups: Group[] }) =>
  sum(progress.groups.map(property('instances.claimed')));

export const getRunCompleteSpecsCount = (progress: { groups: Group[] }) =>
  sum(progress.groups.map(property('instances.complete')));

export const isRunCompleted = (progress: { groups: Group[] }) =>
  getRunOverallSpecsCount(progress) === getRunCompleteSpecsCount(progress);

export const isRunGroupSuccessful = (group: RunGroupProgress) =>
  group.tests.failures === 0 && group.tests.skipped === 0;

export const getRunDurationSeconds = (
  createdAt: Date,
  updatedAt: Date | null,
  inactivityTimeoutMs: number | null
) => {
  if (inactivityTimeoutMs) {
    return inactivityTimeoutMs / 1000;
  }

  return updatedAt ? differenceInSeconds(updatedAt, createdAt) : 0;
};

export const getRunTestsProgressReducer = (r: TestResults, i: TestResults) => {
  ([
    'overall',
    'passes',
    'failures',
    'pending',
    'skipped',
    'flaky',
  ] as const).forEach((key) => (r[key] += i[key] ?? 0));
  return r;
};
export const getRunTestsProgress = (progress: { groups: Group[] }) =>
  progress.groups
    .map(property<ArrayItemType<Group>, Group['tests']>('tests'))
    .reduce(getRunTestsProgressReducer, {
      overall: 0,
      passes: 0,
      failures: 0,
      pending: 0,
      flaky: 0,
      skipped: 0,
    });
