import { ExecutionDriver } from '@src/types';
import { EXECUTION_DRIVER, SCREENSHOTS_DRIVER } from '@src/config';

export const getScreenshotsDriver = async (): Promise<ExecutionDriver> =>
  import(SCREENSHOTS_DRIVER).then(module => module.driver);

export const getExecutionDriver = async (): Promise<ExecutionDriver> =>
  import(EXECUTION_DRIVER).then(module => module.driver);
