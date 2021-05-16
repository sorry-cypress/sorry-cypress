import { getRunDurationSeconds, getNumRetries } from '../';
import { InstanceResultStats } from '../../instance';
import { Test, TestV5 } from '../../tests';
import { getRunSummary } from '../runSummary';
import { cloneDeep } from 'lodash';

import mockTests from './mockTests.json';
import mockInstanceResultStatsOnly from './mockInstanceResultsStatsOnly.json';

const mockInstanceResultStatsAndTests = mockInstanceResultStatsOnly.map(instanceResult => ({
  ...cloneDeep(instanceResult),
  tests: cloneDeep(mockTests) as Test[],
}));

describe('getRunDurationSeconds', () => {
  test('should return duration for multiple specs', () => {
    // 46 - 41 = 5 minutes = 300 sec
    const specs = [
      {
        wallClockStartedAt: '2021-02-21T05:44:00.000Z',
        wallClockEndedAt: '2021-02-21T05:46:00.000Z',
      },
      {
        wallClockStartedAt: '2021-02-21T05:41:00.000Z',
        wallClockEndedAt: '2021-02-21T05:44:00.000Z',
      },
    ] as InstanceResultStats[];

    expect(getRunDurationSeconds(specs)).toEqual(300);
  });

  test('should return duration for single specs', () => {
    const specs = [
      {
        wallClockStartedAt: '2021-02-21T05:44:00.000Z',
        wallClockEndedAt: '2021-02-21T05:46:00.000Z',
      },
    ] as InstanceResultStats[];

    expect(getRunDurationSeconds(specs)).toEqual(120);
  });

  test('should return 0 for no specs', () => {
    const specs = [] as InstanceResultStats[];

    expect(getRunDurationSeconds(specs)).toEqual(0);
  });
});

describe('getNumRetries', () => {
  test('should return number of successful retries', () => {
    expect(getNumRetries(mockTests as TestV5[])).toBe(3);
  });

  test('should gracefully handle lack of data', () => {
    expect(getNumRetries(undefined)).toBe(0);
    expect(getNumRetries([])).toBe(0);
    expect(getNumRetries([false, null, {}])).toBe(0);
    expect(getNumRetries([{
      testId: 'id',
      title: 'title',
      state: 'passed',
      body: 'Test body',
      stack: 'Error stack',
      timings: null,
      wallClockStartedAt: 'start',
      wallClockDuration: 100,
    } as Test])).toBe(0);
  });
});

describe('getRunSummary', () => {
  test('should extract a summary of instance results when only stats are provided', () => {
    expect(getRunSummary(mockInstanceResultStatsOnly)).toEqual({
      tests: 7,
      passes: 5,
      pending: 1,
      failures: 1,
      skipped: 0,
      retries: 0,
      wallClockDurationSeconds: expect.any(Number),
    })
  });

  test('should extract a summary of instance results when stats and tests are provided', () => {
    expect(getRunSummary(mockInstanceResultStatsAndTests)).toEqual({
      tests: 7,
      passes: 5,
      pending: 1,
      failures: 1,
      skipped: 0,
      retries: 6,
      wallClockDurationSeconds: expect.any(Number),
    })
  });
})