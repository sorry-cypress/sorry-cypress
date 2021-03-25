import { getRunDurationSeconds } from '../';
import { InstanceResultStats } from '../../instance';

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
