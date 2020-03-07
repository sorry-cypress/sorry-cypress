import { mapKeys, mapValues, isObject, identity, isPlainObject } from 'lodash';
import { isArray } from 'util';

/**
 * Returns new object by deeply traversing the given "target" object
 * replacing each key by result of applying `fn` on the original key
 *
 * @param target object to traverse
 * @param fn function to produce new keys
 */
export function deepTraverseKeys(
  target: object,
  fn: (key: string) => string = identity
): object {
  if (!isPlainObject(target)) {
    throw new Error('Non-plain object detected');
  }
  return mapValues(
    mapKeys(target, (_: any, key: string) => fn(key)),
    (value: any) => {
      if (isArray(value)) {
        return value.map(i => (isObject(i) ? deepTraverseKeys(i, fn) : i));
      }
      return isObject(value) ? deepTraverseKeys(value, fn) : value;
    }
  );
}
