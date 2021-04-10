import { HookEvent, RunSummary, SlackHook } from '@sorry-cypress/common';
import {
  isResultSuccessful,
  isSlackBranchFilterPassed,
  isSlackEventFilterPassed,
  isSlackResultFilterPassed,
} from '../utils';
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
    ['ONLY_FAILED', { failures: 1, passes: 0, pending: 0, skipped: 0 }],
    ['ONLY_SUCCESSFUL', { failures: 0, passes: 1, pending: 0, skipped: 0 }],
    ['ALL', { failures: 1, passes: 1, pending: 1, skipped: 1 }],
    ['ALL', { failures: 0, passes: 0, pending: 0, skipped: 0 }],
  ])(
    'Should return true when %s filter is matched',
    (filter: string, runSummary: RunSummary) => {
      const slkHook = ({
        ...slackHook,
        slackResultFilter: filter,
      } as unknown) as SlackHook;

      expect(isSlackResultFilterPassed(slkHook, runSummary)).toBe(true);
    }
  );
  it.each([
    ['ONLY_FAILED', { failures: 0, passes: 1, pending: 0, skipped: 0 }],
    ['ONLY_SUCCESSFUL', { failures: 1, passes: 1, pending: 0, skipped: 0 }],
  ])(
    "Should return false when %s filter doesn't match",
    (filter: string, runSummary: RunSummary) => {
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
  ])(
    'Should return true when "%s" branch matches the %p filter',
    (branch: string, filter: [string]) => {
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
  ])(
    `Should return false when "%s" branch doesn't match the %p filter`,
    (branch: string, filter: [string]) => {
      const slkHook = ({
        ...slackHook,
        slackBranchFilter: filter,
      } as unknown) as SlackHook;

      expect(isSlackBranchFilterPassed(slkHook, branch)).toBe(false);
    }
  );
});

describe('isResultSuccessful', () => {
  it.each([
    [true, { failures: 0, passes: 1, pending: 0, skipped: 0 }],
    [true, { failures: 0, passes: 0, pending: 1, skipped: 0 }],
    [true, { failures: 0, passes: 0, pending: 0, skipped: 0 }],
    [false, { failures: 1, passes: 1, pending: 1, skipped: 0 }],
    [false, { failures: 0, passes: 1, pending: 1, skipped: 1 }],
  ])(
    'Should return "%p" when test run results are %p',
    (result: boolean, runSummary: RunSummary) => {
      const slkHook = ({
        ...slackHook,
      } as unknown) as SlackHook;

      expect(isResultSuccessful(runSummary)).toBe(result);
    }
  );
});
