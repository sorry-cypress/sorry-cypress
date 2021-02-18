import { Hook, HookEvent } from '@src/types';
import { isGithubHook } from './hooksEnums';

export function shouldHookHandleEvent(event: HookEvent, hook: Hook) {
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
