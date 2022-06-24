import { ExecutionDriver } from '@sorry-cypress/director/types';
import { initMongo, isMongoDBHealthy } from '@sorry-cypress/mongo';
import * as mongoInstanceController from './instances/instance.controller';
import * as mongoInstanceModel from './instances/instance.model';
import * as mongoProjectModel from './projects/project.model';
import { initRunCompletion } from './runCompletion';
import * as mongoRunController from './runs/run.controller';
import * as mongoRunModel from './runs/run.model';

export const driver: ExecutionDriver = {
  id: 'stateful-mongo',
  init: async () => {
    await initMongo();
    initRunCompletion();
  },
  isDBHealthy: isMongoDBHealthy,
  maybeSetRunCompleted: mongoRunController.maybeSetRunCompleted,
  allGroupSpecsCompleted: mongoRunController.allGroupSpecsCompleted,
  getProjectById: mongoProjectModel.getProjectById,
  getRunById: mongoRunModel.getRunById,
  getInstanceById: mongoInstanceModel.getInstanceById,
  createRun: mongoRunController.createRun,
  getNextTask: mongoRunController.getNextTask,
  setVideoUrl: mongoInstanceController.setVideoUrl,
  setScreenshotUrl: mongoInstanceController.setScreenshotUrl,
  setInstanceResults: mongoInstanceController.setInstanceResults,
  setRunCompleted: mongoRunModel.setRunCompleted,
  setRunCompletedWithTimeout: mongoRunModel.setRunCompletedWithTimeout,
  setInstanceTests: mongoInstanceController.setInstanceTests,
  updateInstanceResults: mongoInstanceController.updateInstanceResults,
};
