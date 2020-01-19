import { InstanceResult } from '@src/types';

export const isInstanceFailed = (results: InstanceResult) =>
  results.stats.failures > 0;
