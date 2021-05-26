import { HookEvent } from '@sorry-cypress/common';
import { pubsub } from '../pubsub';

export const emitInstanceStart = (payload: InstanceEventPayload) =>
  pubsub.emit(HookEvent.INSTANCE_START, payload);

export const emitInstanceFinish = (payload: InstanceEventPayload) =>
  pubsub.emit(HookEvent.INSTANCE_FINISH, payload);

export const emitRunStart = (payload: RunStartEventPayload) =>
  pubsub.emit(HookEvent.RUN_START, payload);

export const emitRunFinish = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.RUN_FINISH, payload);

export const emitRunTimedout = (payload: PubSubHookEventPayload) =>
  pubsub.emit(HookEvent.RUN_TIMEOUT, payload);

interface PubSubHookEventPayload {
  runId: string;
  groupId: string;
}
type InstanceEventPayload = PubSubHookEventPayload & {
  spec: string;
};

type RunStartEventPayload = PubSubHookEventPayload & {
  projectId: string;
};

export type HookEventPayload =
  | PubSubHookEventPayload
  | RunStartEventPayload
  | InstanceEventPayload;
