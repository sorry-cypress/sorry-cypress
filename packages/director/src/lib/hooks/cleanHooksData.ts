import { hookReportSchema } from '@src/lib/schemas';
import Ajv from 'ajv';
import { cloneDeep } from 'lodash';
import { RunSummaryForHooks } from './types';

const ajv = new Ajv({ removeAdditional: 'all' });
const cleanHookReportData = ajv.compile(hookReportSchema);

export const getCleanHookReportData = (
  runSummary: RunSummaryForHooks
): RunSummaryForHooks => {
  const cloned = cloneDeep(runSummary);
  // TODO: this fn mutates the data, replace with pure
  cleanHookReportData(cloned);
  return cloned;
};
