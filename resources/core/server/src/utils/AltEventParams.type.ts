import type { IServerEvent } from 'alt-server';

export type AltEventParams<E extends keyof IServerEvent> = Parameters<IServerEvent[E]>;
