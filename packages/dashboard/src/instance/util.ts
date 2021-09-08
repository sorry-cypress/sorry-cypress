import { InstanceTest } from '@sorry-cypress/dashboard/generated/graphql';
import { orderBy, sum } from 'lodash';

export const getTestDuration = (test: InstanceTest) => {
  return sum(test.attempts.map((a) => a.wallClockDuration)) ?? 0;
};

export const getTestStartedAt = (test: InstanceTest) => {
  const attempts = orderBy(test.attempts, 'wallClockStartedAt');
  if (!attempts.length) {
    return null;
  }
  return attempts[0].wallClockStartedAt;
};
