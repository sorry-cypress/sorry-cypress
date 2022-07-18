import {
  BitBucketHook,
  GChatHook,
  GenericHook,
  GithubHook,
  Hook,
  SlackHook,
  TeamsHook,
} from './types';

export function isGenericHook(hook: Hook): hook is GenericHook {
  return hook.hookType === 'GENERIC_HOOK';
}

export function isSlackHook(hook: Hook): hook is SlackHook {
  return hook.hookType === 'SLACK_HOOK';
}

export function isGithubHook(hook: Hook): hook is GithubHook {
  return hook.hookType === 'GITHUB_STATUS_HOOK';
}

export function isBitbucketHook(hook: Hook): hook is BitBucketHook {
  return hook.hookType === 'BITBUCKET_STATUS_HOOK';
}

export function isTeamsHook(hook: Hook): hook is TeamsHook {
  return hook.hookType === 'TEAMS_HOOK';
}

export function isGChatHook(hook: Hook): hook is GChatHook {
  return hook.hookType === 'GCHAT_HOOK';
}
