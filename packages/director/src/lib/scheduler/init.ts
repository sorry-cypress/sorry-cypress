/**
 * This implementation is unfriendly for
 * - serverless runtime
 * - multi node setup
 * An proper alternative would be an external service
 * that invokes inactivity check after a timeout
 */
import { hookEvents } from '@sorry-cypress/common';
import { PubSubHookEventPayload } from '../hooks/events';
import { pubsub } from '../pubsub';
import { inMemoryScheduler } from './inmemory';

const schedulerType: string = 'notinmemory';

let _redisScheduerModule: any = null;
const handleSchedulerEvent = async ({ runId }: PubSubHookEventPayload) => {
  if (schedulerType === 'inmemory') {
    inMemoryScheduler(runId).catch(console.error);
    return;
  }
  if (!_redisScheduerModule) {
    _redisScheduerModule = await import('./redis');
  }

  _redisScheduerModule.redisScheduler(runId).catch(console.error);
};

console.log('🎧 Initializing listeners for scheduler...');
[hookEvents.RUN_START, hookEvents.INSTANCE_START].forEach((event) => {
  pubsub.on(event, handleSchedulerEvent);
});
