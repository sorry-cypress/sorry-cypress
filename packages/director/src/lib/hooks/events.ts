import { HookEvent } from '@sorry-cypress/common';
import { pubsub } from '../pubsub';

export interface PubSubHookEventPayload {
  runId: string;
}
export const emitRunStart = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.RUN_START, payload);

export const emitInstanceStart = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.INSTANCE_START, payload);

export const emitInstanceFinish = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.INSTANCE_FINISH, payload);

export const emitGroupFinish = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.RUN_FINISH, payload);

export const emitGroupTimedout = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.RUN_TIMEOUT, payload);
