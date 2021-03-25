import { HookEvent } from '@sorry-cypress/common';
import { getExecutionDriver } from '@src/drivers';
import { pubsub } from '../pubsub';
import { PubSubHookEventPayload } from './events';
import { reportToHook } from './reporters/controller';

const handleHookEvent = (eventType: HookEvent) => async ({
  runId,
}: PubSubHookEventPayload) => {
  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunWithSpecs(runId);
  const project = await executionDriver.getProjectById(run.meta.projectId);
  console.log(`Reporting ${eventType} for ${runId}...`);
  reportToHook({
    hookEvent: eventType,
    run,
    project,
  });
};

export async function init() {
  console.log('🎧 Initializing listeners for hooks...');

  for (const event of Object.values(HookEvent)) {
    pubsub.on(event, handleHookEvent(event));
  }
}
