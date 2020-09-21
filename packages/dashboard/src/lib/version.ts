import { isNil } from 'lodash';

export function isTestGteV5(test: { attempts?: any }) {
  return !isNil(test.attempts);
}

export function areTestsGteV5(tests: Array<any> | null) {
  if (!tests?.length) {
    return true;
  }
  return tests.some(isTestGteV5);
}
