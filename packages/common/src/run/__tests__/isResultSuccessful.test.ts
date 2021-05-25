import { RunSummary } from '@sorry-cypress/common';
import { isResultSuccessful } from '../runSummary';

describe('isResultSuccessful', () => {
  it.each([
    [true, { failures: 0, passes: 1, pending: 0, skipped: 0 }],
    [true, { failures: 0, passes: 0, pending: 1, skipped: 0 }],
    [true, { failures: 0, passes: 0, pending: 0, skipped: 0 }],
    [false, { failures: 1, passes: 1, pending: 1, skipped: 0 }],
    [false, { failures: 0, passes: 1, pending: 1, skipped: 1 }],
  ])(
    'Should return "%p" when test run results are %p',
    // @ts-expect-error
    (result: boolean, runSummary: RunSummary) => {
      expect(isResultSuccessful(runSummary)).toBe(result);
    }
  );
});
