import { sum } from 'lodash';

export function getTestRetries(state: string, attemptsCount: number) {
  return state === 'passed' ? attemptsCount - 1 : 0;
}

type TestShape = {
  state?: string;
  attempts: any[];
};
export function getTestListRetries(tests: TestShape[]) {
  return sum(
    tests.map((t) => getTestRetries(t.state ?? '', t.attempts.length))
  );
}
