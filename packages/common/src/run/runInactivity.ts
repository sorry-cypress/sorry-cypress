import { InstanceResult } from '../instance';
import { RunSpec } from './types';

export const isRunPendingInactivityTimeout = (
  _specs: Array<RunSpec & { results: InstanceResult }>
) => {
  const claimed = _specs.filter((s) => !!s.claimed);
  const reported = _specs.filter((s) => !!s.results);
  return claimed.length === reported.length;
};
