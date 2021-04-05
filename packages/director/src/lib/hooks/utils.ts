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
      return !hook.slackBranchFilter.every((filter) => {
        const pattern = new RegExp(`^${filter}$`);
        return branch.search(pattern) === -1;
      });
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
