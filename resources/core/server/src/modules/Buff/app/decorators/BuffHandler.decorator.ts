import { BuffType } from '@shared';
import type { interfaces } from 'inversify';
import { Injectable } from '@altv-mango/core';
import type { IBuffHandler } from '../../domain';

export const BuffHandlerRegistry = new Map<
    BuffType,
    {
        serviceIdentifier: interfaces.ServiceIdentifier<IBuffHandler>;
    }
>();

type BuffHandlerClass = interfaces.Newable<IBuffHandler>;

export function BuffHandler(buffType: BuffType) {
    return (target: BuffHandlerClass) => {
        Injectable()(target);

        if (BuffHandlerRegistry.has(buffType)) {
            throw new Error(`BuffHandler with buffType ${buffType} already registered`);
        }

        BuffHandlerRegistry.set(buffType, {
            serviceIdentifier: target,
        });
    };
}
