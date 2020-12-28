import { HookEvent, HookType } from '@src/types';
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
