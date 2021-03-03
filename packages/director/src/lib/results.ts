import { InstanceResult } from '@src/types';
export const isInstanceFailed = (results: InstanceResult) =>
  results.stats.failures > 0;

function sanitizeKey(_: string, value: any) {
  if (value && typeof value === 'object') {
    const replacement: Record<string, any> = {};
    for (const key in value) {
      replacement[key.replace('$', '_').replace('.', '_')] = value[key];
    }
    return replacement;
  }
  return value;
}
export const getSanitizedMongoObject = (target: any) =>
  JSON.parse(JSON.stringify(target, sanitizeKey));
