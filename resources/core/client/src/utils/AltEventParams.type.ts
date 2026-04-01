import type { IClientEvent } from 'alt-client';

export type AltEventParams<E extends keyof IClientEvent> = Parameters<IClientEvent[E]>;
