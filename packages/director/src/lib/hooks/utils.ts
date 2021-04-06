import {
  EventFilter,
  HookEvent,
  HookWithCustomEvents,
  isGithubHook,
  isSlackHook,
  RunSummary,
} from '@sorry-cypress/common';

export function shouldHookHandleEvent(
  event: HookEvent,
  hook: HookWithCustomEvents,
  runSummary: RunSummary,
  branch: string
) {
  if (isGithubHook(hook)) {
    return true;
  }

  if (isSlackHook(hook)) {
    if (
      hook.slackEventFilter === EventFilter.ONLY_FAILED &&
      runSummary.failures === 0 &&
      runSummary.skipped === 0
    ) {
      return false;
    }

    if (
      (hook.slackEventFilter === EventFilter.ONLY_SUCCESSFUL &&
        runSummary.failures > 0) ||
      runSummary.skipped > 0
    ) {
      return false;
    }

    if (hook.slackBranchFilter && hook.slackBranchFilter.length > 0) {
      const isBranchInFilter = !hook.slackBranchFilter.every((filter) => {
        const pattern = new RegExp(`^${filter}$`);
        return branch.search(pattern) === -1;
      });

      if (!isBranchInFilter) return false;
    }

    if (!hook.hookEvents || !hook.hookEvents.length) {
      return true;
    }

    if (hook.hookEvents.includes(event)) {
      return true;
    }
  }

  return false;
}

export function isResultSuccessful(runSummary: RunSummary) {
  // Cypress is based on Mocha framework which has a not obvious results naming:
  // Pending: tests you don't plan to run (it.skip(), for example)
  // Skipped: tests you have planned to run, but, for example, before hook was failed
  // Therefore we mark skipped tests as failed
  // See details here: https://github.com/cypress-io/cypress/issues/3092
  return !(runSummary.failures > 0 || runSummary.skipped > 0);
}
