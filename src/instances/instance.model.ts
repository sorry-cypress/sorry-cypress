import { getMongoDB } from '../lib/mongo';
import { AppError, INSTANCE_EXISTS } from '../lib/errors';

export const insertInstance = async (instanceId: string, instance: object) => {
  try {
    const { result } = await getMongoDB()
      .collection('instances')
      .insertOne({
        instanceId,
        results: instance
      });
    return result;
  } catch (error) {
    if (error.code && error.code === 11000) {
      throw new AppError(INSTANCE_EXISTS);
    }
    throw error;
  }
};
