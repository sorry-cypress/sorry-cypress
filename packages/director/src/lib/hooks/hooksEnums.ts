import {
  GenericHook,
  HookEvent,
  Hook,
  HookType,
  GithubHook,
  SlackHook,
} from '@src/types';
export const hookEvents = {
  RUN_START: 'RUN_START',
  RUN_FINISH: 'RUN_FINISH',
  INSTANCE_START: 'INSTANCE_START',
  INSTANCE_FINISH: 'INSTANCE_FINISH',
} as Record<string, HookEvent>;

export const hookTypes = {
  GITHUB_STATUS_HOOK: 'GITHUB_STATUS_HOOK',
  GENERIC_HOOK: 'GENERIC_HOOK',
} as Record<string, HookType>;

export function isGenericHook(hook: Hook): hook is GenericHook {
  return hook.hookType === 'GENERIC_HOOK';
}

export function isSlackHook(hook: Hook): hook is SlackHook {
  return hook.hookType === 'SLACK_HOOK';
}

export function isGithubHook(hook: Hook): hook is GithubHook {
  return hook.hookType === 'GITHUB_STATUS_HOOK';
}
