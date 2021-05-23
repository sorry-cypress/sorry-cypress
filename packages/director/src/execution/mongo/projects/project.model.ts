import { Collection } from '@sorry-cypress/mongo/dist';
import { AppError, PROJECT_CREATE_FAILED } from '@src/lib/errors';
import { Project } from '@src/types';

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
