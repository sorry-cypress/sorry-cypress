import { ArrayItemType } from '@src/lib/ts';
import { differenceInSeconds, parseISO } from 'date-fns';
import { property, sum } from 'lodash';
import {
  RunCompletion,
  RunGroupProgressTestsFragment,
  RunProgressFragment,
} from '../generated/graphql';

export const getRunOverallSpecsCount = (progress: RunProgressFragment) =>
  sum(progress.groups.map(property('instances.overall')));

export const getRunClaimedSpecsCount = (progress: RunProgressFragment) =>
  sum(progress.groups.map(property('instances.claimed')));

export const getRunCompleteSpecsCount = (progress: RunProgressFragment) =>
  sum(progress.groups.map(property('instances.claimed')));

export const getRunDurationSeconds = (
  createdAt: string,
  progress: RunProgressFragment,
  completion: RunCompletion
) => {
  if (completion.completed && completion.inactivityTimeoutMs) {
    return completion.inactivityTimeoutMs / 1000;
  }

  return progress.updatedAt
    ? differenceInSeconds(parseISO(progress.updatedAt), parseISO(createdAt))
    : 0;
};

export const getRunTestsProgress = (progress: RunProgressFragment) =>
  progress.groups
    .map(
      property<
        ArrayItemType<typeof progress['groups']>,
        RunGroupProgressTestsFragment
      >('tests')
    )
    .reduce(
      (r, i) => {
        ([
          'overall',
          'passes',
          'failures',
          'pending',
          'retries',
          'flaky',
        ] as const).forEach((key) => (r[key] += i[key] ?? 0));
        return r;
      },
      {
        overall: 0,
        passes: 0,
        failures: 0,
        retries: 0,
        pending: 0,
        flaky: 0,
      } as const
    );
