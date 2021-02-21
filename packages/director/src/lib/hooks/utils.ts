import {
  Hook,
  HookEvent,
  isGithubHook,
  RunSummary,
} from '@sorry-cypress/common';
import { hookReportSchema } from '@src/lib/schemas';
import { cloneDeep } from 'lodash';
import Ajv from 'ajv';

const ajv = new Ajv({ removeAdditional: 'all' });
const cleanHookReportData = ajv.compile(hookReportSchema);

export const getCleanHookReportData = (runSummary: RunSummary): RunSummary => {
  const cloned = cloneDeep(runSummary);
  // TODO: this fn mutates the data, replace with pure
  cleanHookReportData(cloned);
  return cloned;
};

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
