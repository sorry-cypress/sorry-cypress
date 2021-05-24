import { HookEvent } from '@sorry-cypress/common';
import { getExecutionDriver } from '@src/drivers';
import { pubsub } from '../pubsub';
import { HookEventPayload } from './events';
import { reportToHooks } from './reporters/controller';

const handleHookEvent = (eventType: HookEvent) => async (
  payload: HookEventPayload
) => {
  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunWithSpecs(payload.runId);
  const project = await executionDriver.getProjectById(run.meta.projectId);
  console.log(`[hooks] Reporting ${eventType} for ${payload.runId}...`);

  reportToHooks({
    eventType,
    run,
    project,
    ...payload,
  });
};

export async function init() {
  console.log('🎧 Initializing listeners for hooks...');

  for (const event of Object.values(HookEvent)) {
    pubsub.on(event, handleHookEvent(event));
  }
}
