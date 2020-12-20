import { hookReportSchema } from '@src/lib/schemas';
import Ajv from 'ajv';
import { cloneDeep } from 'lodash';

const ajv = new Ajv({ removeAdditional: 'all' });
const cleanHookReportData = ajv.compile(hookReportSchema);

export const getCleanHookReportData = (data: unknown) => {
  const cloned = cloneDeep(data);
  cleanHookReportData(cloned);
  return cloned;
};
