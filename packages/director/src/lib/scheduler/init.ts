/**
 * serverless: This implementation is unfriendly for serverless environments
 */
import { HookEvent } from '@sorry-cypress/common';
import { REDIS_URI } from '@src/config';
import { PubSubHookEventPayload } from '../hooks/events';
import { pubsub } from '../pubsub';
import { inMemoryScheduler } from './inmemory';

const schedulerType: 'queue' | 'memory' = REDIS_URI ? 'queue' : 'memory';
let _queueScheduler: any = null;

export async function init() {
  console.log('🎧 Initializing listeners for inactivity timeout scheduler...');
  [HookEvent.RUN_START, HookEvent.INSTANCE_START].forEach((event) => {
    pubsub.on(event, scheduleInactivityTimeout);
  });

  if (schedulerType === 'queue' && !_queueScheduler) {
    console.log('🎧 Initializing inactivity timeout queue...');
    _queueScheduler = await import('./queue');
  }
}

export async function shutdown() {
  if (!_queueScheduler) {
    return;
  }
  await _queueScheduler.scheduler.close();
}

const scheduleInactivityTimeout = async ({ runId }: PubSubHookEventPayload) => {
  if (schedulerType === 'memory') {
    inMemoryScheduler(runId).catch(console.error);
    return;
  }

  _queueScheduler.setInactivityTimeoutJob(runId);
};
