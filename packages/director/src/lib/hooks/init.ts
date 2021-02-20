import { pubsub } from '../pubsub';
import { HookEvent, hookEvents } from '@sorry-cypress/common';
import { getExecutionDriver } from '@src/drivers';
import { reportToHook } from './reporters/controller';
import { PubSubHookEventPayload } from './events';

const handleHookEvent = (eventType: HookEvent) => async ({
  runId,
}: PubSubHookEventPayload) => {
  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunWithSpecs(runId);
  const project = await executionDriver.getProjectById(run.meta.projectId);
  console.log(`Reporing ${eventType} for ${runId}...`);
  reportToHook({
    hookEvent: eventType,
    run,
    project,
  });
};

console.log('🎧 Initializing listeners for hooks...');

for (const event of Object.values(hookEvents)) {
  pubsub.on(event, handleHookEvent(event));
}
