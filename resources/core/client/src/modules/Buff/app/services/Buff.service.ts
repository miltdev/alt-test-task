import { Inject, Injectable } from '@altv-mango/core';
import { BuffHandlerService } from './BuffHandler.service';
import alt from 'alt-client';
import { BuffType, EntityStreamSyncedMetaKey } from '@shared';

@Injectable()
export class BuffService {
    constructor(
        @Inject(BuffHandlerService)
        private readonly buffHandlerService: BuffHandlerService,
    ) {}

    public async handleEntityBuffsChanged(
        entity: alt.Entity,
        value: BuffType[] | undefined,
        oldValue: BuffType[] | undefined,
    ): Promise<void> {
        const normalizedBuffs = value ?? [];
        const normalizedOldBuffs = oldValue ?? [];

        const buffsToRemove = normalizedOldBuffs.filter((buffType) => !normalizedBuffs.includes(buffType));
        for (const buffType of buffsToRemove) {
            const handler = this.buffHandlerService.findBuffHandler(buffType);
            if (handler) {
                await handler.onRemove(entity);
            }
        }

        const buffsToApply = normalizedBuffs.filter((buffType) => !normalizedOldBuffs.includes(buffType));
        for (const buffType of buffsToApply) {
            const handler = this.buffHandlerService.findBuffHandler(buffType);
            if (handler) {
                await handler.onApply(entity);
            }
        }
    }

    public async handleEntityStreamIn(entity: alt.Entity): Promise<void> {
        const entityBuffTypes = entity.getStreamSyncedMeta(EntityStreamSyncedMetaKey.Buffs);
        if (!entityBuffTypes) {
            return;
        }

        for (const buffType of entityBuffTypes) {
            const handler = this.buffHandlerService.findBuffHandler(buffType);
            if (handler) {
                await handler.onApply(entity);
            }
        }
    }

    public async handleEntityStreamOut(entity: alt.Entity): Promise<void> {
        const entityBuffTypes = entity.getStreamSyncedMeta(EntityStreamSyncedMetaKey.Buffs);
        if (!entityBuffTypes) {
            return;
        }

        for (const buffType of entityBuffTypes) {
            const handler = this.buffHandlerService.findBuffHandler(buffType);
            if (handler) {
                await handler.onRemove(entity);
            }
        }
    }
}
