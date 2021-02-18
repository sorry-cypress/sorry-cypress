import { pubsub } from '../pubsub';
import { hookEvents } from './hooksEnums';
import { HookEventPayload } from './types';

export const emitRunStart = (payload: HookEventPayload) =>
  pubsub.emit(hookEvents.RUN_START, payload);

export const emitInstanceStart = (payload: HookEventPayload) =>
  pubsub.emit(hookEvents.INSTANCE_START, payload);

export const emitInstanceFinish = (payload: HookEventPayload) =>
  pubsub.emit(hookEvents.INSTANCE_FINISH, payload);

export const emitRunFinish = (payload: HookEventPayload) =>
  pubsub.emit(hookEvents.RUN_FINISH, payload);
