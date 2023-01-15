import {
  EXECUTION_DRIVER,
  SCREENSHOTS_DRIVER,
} from '@sorry-cypress/director/config';
import {
  ExecutionDriver,
  ScreenshotsDriver,
} from '@sorry-cypress/director/types';
import { getLogger } from '@sorry-cypress/logger';

let executionDriver: ExecutionDriver | null = null;
let storageDriver: ScreenshotsDriver | null = null;

export const getScreenshotsDriver = async (): Promise<ScreenshotsDriver> => {
  if (storageDriver) {
    return storageDriver;
  }
  const module = await import(SCREENSHOTS_DRIVER);
  storageDriver = module.driver;
  if (!storageDriver) {
    throw new Error('Cannot determine storage driver');
  }
  await storageDriver.init();
  return storageDriver;
};

export const getExecutionDriver = async (): Promise<ExecutionDriver> => {
  if (executionDriver) {
    return executionDriver;
  }
  const module = await import(EXECUTION_DRIVER);
  executionDriver = module.driver;
  if (!executionDriver) {
    throw new Error('Cannot determine execution driver');
  }
  await executionDriver.init();
  getLogger().log(`🔧 Director execution driver: ${executionDriver.id}`);
  return executionDriver;
};
