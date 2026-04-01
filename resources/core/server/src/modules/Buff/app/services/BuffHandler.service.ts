import { Inject, Injectable, MODULE_CONTAINER } from '@altv-mango/core';
import { type BuffType } from '@shared';
import type { Container } from 'inversify';
import type { IBuffHandler } from '../../domain';
import { BuffHandlerRegistry } from '../decorators';

@Injectable()
export class BuffHandlerService {
    constructor(
        @Inject(MODULE_CONTAINER)
        private readonly container: Container,
    ) {}

    public getBuffHandler(type: BuffType): IBuffHandler {
        const serviceIdentifier = BuffHandlerRegistry.get(type)?.serviceIdentifier;
        if (!serviceIdentifier) {
            throw new Error(`Not found registered handler for buffType ${type}`);
        }

        return this.container.get(serviceIdentifier);
    }
}
