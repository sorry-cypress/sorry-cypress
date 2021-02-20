import { GenericHook, Hook, GithubHook, SlackHook } from './types';

export function isGenericHook(hook: Hook): hook is GenericHook {
  return hook.hookType === 'GENERIC_HOOK';
}

export function isSlackHook(hook: Hook): hook is SlackHook {
  return hook.hookType === 'SLACK_HOOK';
}

export function isGithubHook(hook: Hook): hook is GithubHook {
  return hook.hookType === 'GITHUB_STATUS_HOOK';
}
