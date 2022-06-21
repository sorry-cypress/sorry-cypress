import { getLogger } from '@sorry-cypress/logger';
import { RequestHandler } from 'express';

export const catchRequestHandlerErrors = (fn: RequestHandler) => async (
  req,
  res,
  next
) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    getLogger().error({ error });
    next(error);
  }
};
