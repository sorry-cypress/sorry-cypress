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
      const isBranchInFilter = !hook.slackBranchFilter
        // Branch filter supports only '*' and '?' wildcard symbols, not full regex syntax,
        // so first we escape all special symbols except '*' and '?'
        // and then replace '*' with '.*' and '?' with '.' before passing this string to regex.
        // We shouldn't warn about handling branch names having '*' or '?' symbols
        // as such names are prohibited (see 'man git-check-ref-format')
        .map((filter: string) =>
          filter
            .replace(/[\-\[\]\/\{\}\(\)\+\.\\\^\$\|]/g, '\\$&')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.')
        )
        // Then we just check all filters for a mach with a users' branch,
        // and if all filters don't matched (returned -1)
        // we return inverted value to set isBranchInFilter to 'false'
        .every(
          (filter: string) =>
            branch.search(new RegExp(`^${filter}$`, 'i')) === -1
        );

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
