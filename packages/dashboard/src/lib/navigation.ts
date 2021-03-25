import { makeVar } from '@apollo/client';
import { isNil } from 'lodash';

interface NavItem {
  label?: string | null;
  link: string;
}
export const navStructure = makeVar<NavItem[]>([]);

export const setNav = (elements: NavItem[]) =>
  navStructure(
    elements.map((e) => ({
      ...e,
      label: e.label ? encodeURIComponent(e.label) : e.label,
    }))
  );

const detectBadPath = (fn: (value: string) => string) => (value: unknown) => {
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
export const getTestPath = (instanceId: string, testId: string) =>
  `instance/${instanceId}/test/${testId}`;
