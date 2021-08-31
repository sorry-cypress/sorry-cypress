import { Project } from '@sorry-cypress/common';
import {
  AppError,
  PROJECT_CREATE_FAILED,
} from '@sorry-cypress/director/lib/errors';
import { Collection } from '@sorry-cypress/mongo';

export const getProjectById = (id: string) =>
  Collection.project().findOne({ projectId: id });

export const createProject = async (project: Project) => {
  try {
    await Collection.project().insertOne(project);
    return project;
  } catch (error) {
    if (error.code) {
      throw new AppError(PROJECT_CREATE_FAILED);
    }
    throw error;
  }
};
