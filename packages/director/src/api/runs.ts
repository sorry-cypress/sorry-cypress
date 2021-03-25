import { getExecutionDriver } from '@src/drivers';
import { isKeyAllowed } from '@src/lib/allowedKeys';
import { emitRunStart } from '@src/lib/hooks/events';
import { CreateRunParameters } from '@src/types';
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
  const { group, ciBuildId } = req.body;
  const cypressVersion = req.headers['x-cypress-version'].toString();

  const executionDriver = await getExecutionDriver();

  console.log(`>> Machine is joining / creating  a run`, { ciBuildId, group });
  const response = await executionDriver.createRun({
    ...req.body,
    cypressVersion,
  });

  if (response.isNewRun) {
    emitRunStart({ runId: response.runId });
  }

  console.log(`<< Responding to machine`, response);
  return res.json(response);
};
