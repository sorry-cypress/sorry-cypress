import { getSanitizedMongoObject } from '../results';
import fixture280 from './fixtures/issue-280.json';
import fixture31 from './fixtures/issue-31.json';

test('does not throw', () => {
  const result = getSanitizedMongoObject(fixture280);
  expect(result.body.stats.tests).toEqual(20);
  expect(
    result.body.tests[0].attempts[0].timings['before each'][0].hookId
  ).toEqual('h1');
});

test('removes illegal chars', () => {
  const result = getSanitizedMongoObject(fixture31);
  expect(result['dot_dot'].value).toEqual('dot.dot');
  expect(result['_schema'].value).toEqual('$schema');
});
