import { makeVar } from '@apollo/client';
import { isNil } from 'lodash';

interface NavItem {
  label?: string | null;
  link: string;
}
export const navStructure = makeVar<NavItem[]>([]);

const detectBadPath = (fn: Function) => (value: unknown) => {
  if (isNil(value)) {
    throw new Error(`Uknown path param for ${fn.name}`);
  }
  return fn(value as string);
};

export const getProjectPath = detectBadPath(
  (projectId: string) => `${projectId}/runs`
);
export const getRunPath = detectBadPath((id: string) => `run/${id}`);
export const getInstancePath = detectBadPath((id: string) => `instance/${id}`);
const _getTestPath = (instanceId: string, testId: string) =>
  `instance/${instanceId}/test/${testId}`;
export const getTestPath = _getTestPath;
