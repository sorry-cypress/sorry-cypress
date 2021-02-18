import { pubsub } from '../pubsub';
import { hookEvents } from './hooksEnums';
import { getExecutionDriver } from '@src/drivers';
import { reportToHook } from './hooksReporter';
import { HookEventPayload } from './types';
import { HookEvent } from '@src/types';

const handleHookEvent = (eventType: HookEvent) => async ({
  runId,
}: HookEventPayload) => {
  console.log(`🔊  Handling ${eventType} for hooks`);

  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunWithSpecs(runId);
  const project = await executionDriver.getProjectById(run.meta.projectId);
  reportToHook({
    hookEvent: eventType,
    run,
    project,
  });
};

console.log('🎧 Initializing pubsub listeners for hooks...');

for (const event of Object.values(hookEvents)) {
  pubsub.on(event, handleHookEvent(event));
}
