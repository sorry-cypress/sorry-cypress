import { HookEvent, RunGroupProgress, SlackHook } from '@sorry-cypress/common';
import {
  isSlackBranchFilterPassed,
  isSlackEventFilterPassed,
  isSlackResultFilterPassed,
} from '../slack';
import slackHook from './fixtures/slackHook.json';

describe('isSlackEventFilterPassed', () => {
  it('Should return true when the filter is null', () => {
    const slkHook = ({
      ...slackHook,
      hookEvents: null,
    } as unknown) as SlackHook;

    expect(isSlackEventFilterPassed(HookEvent.RUN_FINISH, slkHook)).toBe(true);
  });
  it('Should return true when the filter is empty', () => {
    const slkHook = ({
      ...slackHook,
      hookEvents: [],
    } as unknown) as SlackHook;

    expect(isSlackEventFilterPassed(HookEvent.RUN_FINISH, slkHook)).toBe(true);
  });
  it('Should return true when the filter is matched', () => {
    const slkHook = ({
      ...slackHook,
      hookEvents: ['RUN_FINISH'],
    } as unknown) as SlackHook;

    expect(isSlackEventFilterPassed(HookEvent.RUN_FINISH, slkHook)).toBe(true);
  });
  it("Should return false when the filter doesn't match", () => {
    const slkHook = ({
      ...slackHook,
      hookEvents: ['RUN_FINISH'],
    } as unknown) as SlackHook;

    expect(isSlackEventFilterPassed(HookEvent.INSTANCE_FINISH, slkHook)).toBe(
      false
    );
  });
});

describe('isSlackResultFilterPassed', () => {
  it.each([
    [
      'ONLY_FAILED',
      { tests: { failures: 1, passes: 0, pending: 0, skipped: 0 } },
    ],
    [
      'ONLY_SUCCESSFUL',
      { tests: { failures: 0, passes: 1, pending: 0, skipped: 0 } },
    ],
    ['ALL', { tests: { failures: 1, passes: 1, pending: 1, skipped: 1 } }],
    ['ALL', { tests: { failures: 0, passes: 0, pending: 0, skipped: 0 } }],
  ])(
    'Should return true when %s filter is matched',
    (filter: string, runSummary: RunGroupProgress) => {
      const slkHook = ({
        ...slackHook,
        slackResultFilter: filter,
      } as unknown) as SlackHook;

      expect(isSlackResultFilterPassed(slkHook, runSummary)).toBe(true);
    }
  );
  it.each([
    [
      'ONLY_FAILED',
      { tests: { failures: 0, passes: 1, pending: 0, skipped: 0 } },
    ],
    [
      'ONLY_SUCCESSFUL',
      { tests: { failures: 1, passes: 1, pending: 0, skipped: 0 } },
    ],
  ])(
    "Should return false when %s filter doesn't match",
    (filter: string, runSummary: RunGroupProgress) => {
      const slkHook = ({
        ...slackHook,
        slackResultFilter: filter,
      } as unknown) as SlackHook;

      expect(isSlackResultFilterPassed(slkHook, runSummary)).toBe(false);
    }
  );
});

describe('isSlackBranchFilterPassed', () => {
  it('Should return true when the filter is null', () => {
    const slkHook = ({
      ...slackHook,
      slackBranchFilter: null,
    } as unknown) as SlackHook;

    expect(isSlackBranchFilterPassed(slkHook, 'master')).toBe(true);
  });
  it('Should return true when the filter is empty', () => {
    const slkHook = ({
      ...slackHook,
      slackBranchFilter: [],
    } as unknown) as SlackHook;

    expect(isSlackBranchFilterPassed(slkHook, 'master')).toBe(true);
  });
  it.each([
    ['master', ['master']],
    ['master', ['develop', 'master']],
    ['master', ['m*r']],
    ['master', ['m?ster']],
    ['master', ['m??te*']],
    ['master', ['m??*', 'develop']],
    ['Master', ['master']],
    ['develop', ['!main']],
    ['main', ['!*dev*']],
  ])(
    'Should return true when "%s" branch matches the %p filter',
    (branch: string, filter: string[]) => {
      const slkHook = ({
        ...slackHook,
        slackBranchFilter: filter,
      } as unknown) as SlackHook;

      expect(isSlackBranchFilterPassed(slkHook, branch)).toBe(true);
    }
  );
  it.each([
    ['master', ['develop']],
    ['master', ['develop', 'release']],
    ['master', ['amaster']],
    ['master', ['mastera']],
    ['master123', ['master']],
    ['master123', ['m*r']],
    ['master123', ['master??']],
    ['develop!', ['!develop!']],
    ['develop', ['!*Dev????']],
  ])(
    `Should return false when "%s" branch doesn't match the %p filter`,
    (branch: string, filter: string[]) => {
      const slkHook = ({
        ...slackHook,
        slackBranchFilter: filter,
      } as unknown) as SlackHook;

      expect(isSlackBranchFilterPassed(slkHook, branch)).toBe(false);
    }
  );
});
