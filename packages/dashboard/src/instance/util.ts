import { InstanceTestUnion } from '@src/generated/graphql';
import { isTestGteV5 } from '@src/lib/version';
import { orderBy, sum } from 'lodash';

export const getTestDuration = (test: InstanceTestUnion) => {
  if (isTestGteV5(test)) {
    return sum(test.attempts.map((a) => a.wallClockDuration));
  }
  return test.wallClockDuration ?? 0;
};

export const getTestStartedAt = (test: InstanceTestUnion) => {
  if (isTestGteV5(test)) {
    const attempts = orderBy(test.attempts, 'wallClockStartedAt');
    if (!attempts.length) {
      return null;
    }
    return attempts[0].wallClockStartedAt;
  }
  return test.wallClockStartedAt ?? null;
};
