import { EventEmitter } from 'eventemitter3';

export const EVENT_EMITTER_ACTIONS = {
  SELECT_COUNTRY_CODE: 'SELECT_COUNTRY_CODE',
  LOGOUT: 'LOGOUT',
} as const;

export type EmitterActionsType = keyof typeof EVENT_EMITTER_ACTIONS;

export type EventPayloads = {
  [EVENT_EMITTER_ACTIONS.SELECT_COUNTRY_CODE]: string;
  [EVENT_EMITTER_ACTIONS.LOGOUT]: void;
};

export class TypedEventEmitter extends EventEmitter<
  keyof EventPayloads,
  EventPayloads
> {}

export const eventEmitter = new TypedEventEmitter();
