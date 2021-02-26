import { InstanceTestUnion, InstanceTestV5 } from '@src/generated/graphql';
import { isNil } from 'lodash';

export function isTestGteV5(test: InstanceTestUnion): test is InstanceTestV5 {
  return !isNil((test as InstanceTestV5).attempts);
}

export function areTestsGteV5(tests: Array<any> | null) {
  if (!tests?.length) {
    return true;
  }
  return tests.some(isTestGteV5);
}
