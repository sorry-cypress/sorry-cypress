import { CreateRunParameters } from '@sorry-cypress/common';
import { getExecutionDriver } from '@sorry-cypress/director/drivers';
import { isKeyAllowed } from '@sorry-cypress/director/lib/allowedKeys';
import { getLogger } from '@sorry-cypress/logger';
import { RequestHandler } from 'express';

export const blockKeys: RequestHandler = (req, res, next) => {
  const { recordKey } = req.body;

  if (!isKeyAllowed(recordKey)) {
    getLogger().warn({ recordKey }, `Record key is not allowed`);

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
  const cypressVersion = req.headers['x-cypress-version']?.toString();
  const executionDriver = await getExecutionDriver();

  getLogger().log(
    { ...req.body, ...req.headers },
    `New machine is requesting to create a run`
  );

  const response = await executionDriver.createRun({
    ...req.body,
    cypressVersion,
  });

  getLogger().log(response, `Responding to machine`);
  return res.json(response);
};
