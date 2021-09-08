import { Run, RunSpec } from '@sorry-cypress/common';
import { generateUUID } from '@sorry-cypress/director/lib/hash';
import { difference } from 'lodash';

export const getSpecsForGroup = (run: Run, groupId: string) =>
  run.specs.filter((spec) => spec.groupId === groupId);
export const getClaimedSpecs = (run: Run, groupId: string) =>
  getSpecsForGroup(run, groupId).filter((s) => s.claimedAt);
export const getFirstUnclaimedSpec = (run: Run, groupId: string) =>
  getSpecsForGroup(run, groupId).find((s) => !s.claimedAt);

interface GetNewSpecsForGroupParams {
  run: Run;
  groupId: string;
  candidateSpecs: string[];
}

export const getNewSpecsInGroup = ({
  run,
  groupId,
  candidateSpecs,
}: GetNewSpecsForGroupParams) => {
  const existingSpecs = getSpecsForGroup(run, groupId).map((spec) => spec.spec);
  return difference(candidateSpecs, existingSpecs);
};

export const enhanceSpec = (groupId: string) => (spec: string): RunSpec => ({
  spec,
  instanceId: generateUUID(),
  claimedAt: null,
  completedAt: null,
  groupId,
});
