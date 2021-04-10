import {
  HookEvent,
  HookWithCustomEvents,
  isGithubHook,
  isSlackHook,
  ResultFilter,
  RunSummary,
  SlackHook,
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
    return isShouldReportSlackHook(event, hook, runSummary, branch);
  }

  return false;
}

export function isShouldReportSlackHook(
  event: HookEvent,
  hook: SlackHook,
  runSummary: RunSummary,
  branch: string
) {
  return (
    isSlackEventFilterPassed(event, hook) &&
    isSlackResultFilterPassed(hook, runSummary) &&
    isSlackBranchFilterPassed(hook, branch)
  );
}

export function isSlackEventFilterPassed(event: HookEvent, hook: SlackHook) {
  if (!hook.hookEvents || !hook.hookEvents.length) {
    return true;
  }

  return hook.hookEvents.includes(event);
}

export function isSlackResultFilterPassed(hook: SlackHook, runSummary: RunSummary) {
  switch (hook.slackResultFilter) {
    case ResultFilter.ONLY_FAILED:
      if (!isResultSuccessful(runSummary)) return true;
      break;
    case ResultFilter.ONLY_SUCCESSFUL:
      if (isResultSuccessful(runSummary)) return true;
      break;
    case ResultFilter.ALL:
      return true;
    default:
      console.log(`Unexpected Slack filter type: ${hook.slackResultFilter}`);
      return false;
  }

  return false;
}

export function isSlackBranchFilterPassed(hook: SlackHook, branch: string) {
  if (!hook.slackBranchFilter || hook.slackBranchFilter.length === 0)
    return true;

  return !hook.slackBranchFilter
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
      (filter: string) => branch.search(new RegExp(`^${filter}$`, 'i')) === -1
    );
}

export function isResultSuccessful(runSummary: RunSummary) {
  // Cypress is based on Mocha framework which has a not obvious results naming:
  // Pending: tests you don't plan to run (it.skip(), for example)
  // Skipped: tests you have planned to run, but, for example, before hook was failed
  // Therefore we mark skipped tests as failed
  // See details here: https://github.com/cypress-io/cypress/issues/3092
  return !(runSummary.failures > 0 || runSummary.skipped > 0);
}
