import { InstanceResult } from '@src/types';
import { deepTraverseKeys } from './lang';
export const isInstanceFailed = (results: InstanceResult) =>
  results.stats.failures > 0;

export const getSanitizedMongoObject = (target: any) =>
  deepTraverseKeys(target, (key: string) =>
    key.replace('$', '_').replace('.', '_')
  );
