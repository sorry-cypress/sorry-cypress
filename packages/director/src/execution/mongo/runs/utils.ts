import { Run } from '@src/types';
import { difference } from 'lodash';

export const getSpecsForGroup = (run: Run, groupId: string) =>
  run.specs.filter((spec) => spec.groupId === groupId);
export const getClaimedSpecs = (run: Run, groupId: string) =>
  getSpecsForGroup(run, groupId).filter((s) => s.claimed);
export const getFirstUnclaimedSpec = (run: Run, groupId: string) =>
  getSpecsForGroup(run, groupId).find((s) => !s.claimed);

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
