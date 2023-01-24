import { HookEvent } from '@sorry-cypress/common';
import { getExecutionDriver } from '@sorry-cypress/director/drivers';
import { getLogger } from '@sorry-cypress/logger';
import { pubsub } from '../pubsub';
import { HookEventPayload } from './events';
import { reportToHooks } from './reporters/controller';

const handleHookEvent = (eventType: HookEvent) => async (
  payload: HookEventPayload
) => {
  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunById(payload.runId);
  if (!run) {
    getLogger().warn(
      { ...payload, eventType },
      '[hooks] No run found to report hooks'
    );
    return;
  }
  const project = await executionDriver.getProjectById(run.meta.projectId);

  if (!project) {
    getLogger().warn(
      { ...payload, eventType },
      '[hooks] No project found to report hooks'
    );
    return;
  }

  getLogger().log(
    { ...payload, eventType },
    `[hooks] Reporting ${eventType} for ${payload.runId}...`
  );

  reportToHooks({
    eventType,
    run,
    project,
    ...payload,
  });
};

export async function init() {
  await getExecutionDriver();
  getLogger().log('🎧 Initializing listeners for hooks...');
  for (const event of Object.values(HookEvent)) {
    pubsub.on(event, handleHookEvent(event));
  }
}
