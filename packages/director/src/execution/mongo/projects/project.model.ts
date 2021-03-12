import { AppError, PROJECT_CREATE_FAILED } from '@src/lib/errors';
import { getMongoDB } from '@src/lib/mongo';
import { Project } from '@src/types';

export const getProjectById = async (id: string) =>
  (await getMongoDB()).collection('projects').findOne({ projectId: id });

export const createProject = async (project: Project) => {
  try {
    // serverless: there's a potential race condition here when running on two machines / serverless environments
    const storedProject = await getProjectById(project.projectId);
    if (!storedProject) {
      const { result } = await getMongoDB()
        .collection('projects')
        .insertOne(project);
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
