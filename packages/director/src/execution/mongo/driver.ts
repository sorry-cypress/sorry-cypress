import { init } from '@src/lib/mongo';
import { ExecutionDriver } from '@src/types';
import * as mongoRunController from './runs/run.controller';
import * as mongoInstanceController from './instances/instance.controller';

export const driver: ExecutionDriver = {
  id: 'stateful-mongo',
  init,
  createRun: mongoRunController.createRun,
  getNextTask: mongoRunController.getNextTask,
  setScreenshotURL: mongoInstanceController.setScreenshotURL,
  setInstanceResults: mongoInstanceController.setInstanceResults
};
