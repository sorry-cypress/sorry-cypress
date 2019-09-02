import { ExecutionDriver } from '@src/types';
import * as mongoRunController from './runs/run.controller';
import * as mongoInstanceController from './instances/instance.controller';

export const statefulMongoExecutionDriver: ExecutionDriver = {
  createRun: mongoRunController.createRun,
  getNextTask: mongoRunController.getNextTask,
  createInstance: mongoInstanceController.createInstance
};
