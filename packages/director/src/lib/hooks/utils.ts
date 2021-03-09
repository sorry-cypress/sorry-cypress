import {
  HookEvent,
  HookWithCustomEvents,
  isGithubHook,
} from '@sorry-cypress/common';

export function shouldHookHandleEvent(
  event: HookEvent,
  hook: HookWithCustomEvents
) {
  if (isGithubHook(hook)) {
    return true;
  }

  if (!hook.hookEvents || !hook.hookEvents.length) {
    return true;
  }

  if (hook.hookEvents.includes(event)) {
    return true;
  }

  return false;
}
