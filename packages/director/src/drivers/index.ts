import {
  ExecutionDriver,
  ScreenshotsDriver,
} from '@sorry-cypress/director/types';
import { getLogger } from '@sorry-cypress/logger';
import { driver as executionDriver } from '../execution/in-memory';
import { driver as screenshotsDriver } from '../screenshots/dummy.driver';

export const getScreenshotsDriver = async (): Promise<ScreenshotsDriver> => {
  await screenshotsDriver.init();
  return screenshotsDriver;
};

export const getExecutionDriver = async (): Promise<ExecutionDriver> => {
  await executionDriver.init();
  getLogger().log(`🔧 Director execution driver: ${executionDriver.id}`);

  return executionDriver;
};
