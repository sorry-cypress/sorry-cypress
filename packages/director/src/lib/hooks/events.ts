import { pubsub } from '../pubsub';
import { hookEvents } from '@sorry-cypress/common';

export interface PubSubHookEventPayload {
  runId: string;
}
export const emitRunStart = (payload: PubSubHookEventPayload) =>
  pubsub.emit(hookEvents.RUN_START, payload);

export const emitInstanceStart = (payload: PubSubHookEventPayload) =>
  pubsub.emit(hookEvents.INSTANCE_START, payload);

export const emitInstanceFinish = (payload: PubSubHookEventPayload) =>
  pubsub.emit(hookEvents.INSTANCE_FINISH, payload);

export const emitRunFinish = (payload: PubSubHookEventPayload) =>
  pubsub.emit(hookEvents.RUN_FINISH, payload);
