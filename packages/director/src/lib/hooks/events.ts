import { HookEvent } from '@sorry-cypress/common';
import { pubsub } from '../pubsub';

export interface PubSubHookEventPayload {
  runId: string;
  groupId: string;
}
type InstanceEventPayload = PubSubHookEventPayload & {
  spec: string;
};

type GroupStartEventPayload = PubSubHookEventPayload & {
  projectId: string;
};

export const emitInstanceStart = (payload: InstanceEventPayload) =>
  pubsub.emit(HookEvent.INSTANCE_START, payload);

export const emitInstanceFinish = (payload: InstanceEventPayload) =>
  pubsub.emit(HookEvent.INSTANCE_FINISH, payload);

export const emitGroupStart = (payload: GroupStartEventPayload) =>
  pubsub.emit(HookEvent.RUN_START, payload);

export const emitGroupFinish = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.RUN_FINISH, payload);

export const emitGroupTimedout = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.RUN_TIMEOUT, payload);
