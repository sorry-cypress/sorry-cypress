import { hookType } from '@src/duplicatedFromDirector/hooksEnums';
import {
  GenericHook,
  GithubHook,
  Hook,
  SlackHook,
} from '@src/duplicatedFromDirector/project.types';
import { capitalize } from 'lodash';

export function isGenericHook(hook: Hook): hook is GenericHook {
  return hook.hookType === hookType.GENERIC_HOOK;
}

export function isBitbucketHook(hook: Hook): hook is GenericHook {
  return hook.hookType === hookType.BITBUCKET_STATUS_HOOK;
}

export function isGithubHook(hook: Hook): hook is GithubHook {
  return hook.hookType === hookType.GITHUB_STATUS_HOOK;
}

export function isSlackHook(hook: Hook): hook is SlackHook {
  return hook.hookType === hookType.SLACK_HOOK;
}

export const hookTypeToString = (item: string | null) => {
  if (!item) {
    throw new Error('No item');
  }
  return capitalize(item).replace(/_/g, ' ');
};
