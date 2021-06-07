import { EXECUTION_DRIVER, SCREENSHOTS_DRIVER } from '@src/config';
import { ExecutionDriver, ScreenshotsDriver } from '@src/types';

let executionDriver: ExecutionDriver | null = null;
let storageDriver: ScreenshotsDriver | null = null;

export const getScreenshotsDriver = async (): Promise<ScreenshotsDriver> => {
  if (storageDriver) {
    return storageDriver;
  }
  const module = await import(SCREENSHOTS_DRIVER);
  storageDriver = module.driver;
  await storageDriver.init();
  return storageDriver;
};

export const getExecutionDriver = async (): Promise<ExecutionDriver> => {
  if (executionDriver) {
    return executionDriver;
  }
  const module = await import(EXECUTION_DRIVER);
  executionDriver = module.driver;
  await executionDriver.init();
  console.log('🔧 Director execution driver: ', executionDriver.id);
  return executionDriver;
};
