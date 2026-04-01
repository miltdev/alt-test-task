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

    public findBuffHandler(type: BuffType): IBuffHandler | null {
        const serviceIdentifier = BuffHandlerRegistry.get(type)?.serviceIdentifier;
        if (!serviceIdentifier) {
            return null;
        }

        return this.container.get(serviceIdentifier);
    }
}
