import { CreateRunParameters } from '@sorry-cypress/common';
import { getExecutionDriver } from '@sorry-cypress/director/drivers';
import { isKeyAllowed } from '@sorry-cypress/director/lib/allowedKeys';
import { RequestHandler } from 'express';

export const blockKeys: RequestHandler = (req, res, next) => {
  const { recordKey } = req.body;

  if (!isKeyAllowed(recordKey)) {
    console.log(`<< Record key is not allowed`, { recordKey });

    return res
      .status(403)
      .send(`Provided record key '${recordKey}' is not allowed`);
  }
  next();
};

export const handleCreateRun: RequestHandler<
  unknown,
  unknown,
  CreateRunParameters
> = async (req, res) => {
  const { group, ciBuildId, ci } = req.body;
  const cypressVersion = req.headers['x-cypress-version']?.toString();

  const executionDriver = await getExecutionDriver();

  console.log(`>> Machine is joining / creating a run`, {
    ciBuildId,
    group,
    ci,
  });

  const response = await executionDriver.createRun({
    ...req.body,
    cypressVersion,
  });

  console.log(`<< Responding to machine`, response);
  return res.json(response);
};
