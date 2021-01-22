import { Project } from '@src/types';
import { getMongoDB } from '@src/lib/mongo';
import { AppError, PROJECT_CREATE_FAILED } from '@src/lib/errors';
import { getSanitizedMongoObject } from '@src/lib/results';

export const getProjectById = async (id: string) =>
  (await getMongoDB()).collection('projects').findOne({ projectId: id });

export const createProject = async (project: Project) => {
  try {
    // TODO: there's a potential race condition here when running on two machines / serverless environments
    const storedProject = await getProjectById(project.projectId);
    if (!storedProject) {
      const { result } = await getMongoDB()
        .collection('projects')
        .insertOne(getSanitizedMongoObject(project));
      return result;
    } else {
      return storedProject;
    }
  } catch (error) {
    if (error.code) {
      throw new AppError(PROJECT_CREATE_FAILED);
    }
    throw error;
  }
};
