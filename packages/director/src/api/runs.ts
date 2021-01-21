import { getExecutionDriver } from '@src/drivers';
import { isKeyAllowed } from '@src/lib/allowedKeys';
import { hookEvents } from '@src/lib/hooks/hooksEnums';
import { reportToHook } from '@src/lib/hooks/hooksReporter';
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
  const executionDriver = await getExecutionDriver();

  console.log(`>> Machine is joining / creating  a run`, { ciBuildId, group });

  const response = await executionDriver.createRun(req.body);
  const runWithSpecs = await executionDriver.getRunWithSpecs(response.runId);

  if (response.isNewRun) {
    reportToHook({
      hookEvent: hookEvents.RUN_START,
      reportData: { run: runWithSpecs },
      project: await executionDriver.getProjectById(
        runWithSpecs.meta.projectId
      ),
    });
    console.log(`<< RUN_START hook called`);
  }

  console.log(`<< Responding to machine`, response);
  return res.json(response);
};
