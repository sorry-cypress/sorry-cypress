import express from 'express';
import semver from 'semver';

class GenericResponseError extends Error {
  // cypress uses 422 to display generic / non branded errors
  status = 422;
  errors: string[] = [];
  constructor(message: string, errors: string[] = []) {
    super(message);
    this.errors = errors;
  }
}

export const validateCypressVersion = (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) => {
  const cypressVersion = req.headers['x-cypress-version']?.toString();

  if (!cypressVersion) {
    console.warn('[validateCypressVersion] No cypress version detected');
    return next();
  }

  if (!semver.valid(cypressVersion)) {
    console.warn('[validateCypressVersion] Invalid cypress version');
    return next();
  }

  if (semver.lt(cypressVersion, '6.7.0')) {
    console.warn(
      `[validateCypressVersion] Unsupported cypress version ${cypressVersion}`
    );
    return next(
      new GenericResponseError(
        `Cypress version ${cypressVersion} is not supported`,
        [
          'Sorry Cypress only supports cypress version gte 6.7.0. Please update cypress package.',
        ]
      )
    );
  }

  return next();
};
