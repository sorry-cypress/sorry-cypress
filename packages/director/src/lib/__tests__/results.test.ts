import { getSanitizedMongoObject } from '../results';
import fixture280 from './fixtures/issue-280.json';
import fixture31 from './fixtures/issue-31.json';

describe('getSanitizedMongoObject', () => {
  test('should pass regression issue #280', () => {
    const result = getSanitizedMongoObject(fixture280);
    expect(result.body.stats.tests).toEqual(20);
    expect(
      result.body.tests[0].attempts[0].timings['before each'][0].hookId
    ).toEqual('h1');
  });

  test('should remove illegal characters', () => {
    const result = getSanitizedMongoObject(fixture31);
    expect(result['dot_dot'].value).toEqual('dot.dot');
    expect(result['_schema'].value).toEqual('$schema');
  });

  test('should preserve arrays', () => {
    const result = getSanitizedMongoObject({
      specs: [
        {
          spec: 'cypress/integration/groupA/a.spec.js',
          instanceId: 'bd3a8df5-08f0-4b87-9f50-f4c02743be94',
          claimedAt: 'date',
          groupId: '1614831046',
        },
        {
          spec: 'cypress/integration/groupA/b.spec.js',
          instanceId: '55a620d1-6ce5-4057-9f9f-cedbd2ec02fd',
          claimedAt: 'date',
          groupId: '1614831046',
        },
      ],
    });
    expect(Array.isArray(result.specs)).toBe(true);
  });
});
