import { InstanceResult } from '@sorry-cypress/common';
export const isInstanceFailed = (results: InstanceResult) =>
  results.stats.failures > 0 || results.stats.skipped > 0;

function sanitizeKey(_: string, value: any) {
  if (Array.isArray(value)) {
    return value;
  }
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
