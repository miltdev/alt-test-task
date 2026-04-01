import { Inject, Injectable } from '@altv-mango/core';
import { BuffHandlerService } from './BuffHandler.service';
import alt from 'alt-client';
import { EntityStreamSyncedMetaKey } from '@shared';

@Injectable()
export class BuffLifecycleService {
    constructor(
        @Inject(BuffHandlerService)
        private readonly buffHandlerService: BuffHandlerService,
    ) {}

    public async tickBuffs(): Promise<void> {
        const streamedEntities = [
            alt.LocalPlayer.local,
            ...alt.Player.streamedIn,
            ...alt.Vehicle.streamedIn,
            ...alt.Ped.streamedIn,
        ];
        const promiseResults = await Promise.allSettled(streamedEntities.map((entity) => this.tickEntityBuffs(entity)));

        for (const result of promiseResults) {
            if (result.status === 'rejected') {
                alt.logError('Error on tick buffs: ', result.reason);
            }
        }
    }

    private async tickEntityBuffs(entity: alt.Entity) {
        const buffs = entity.getStreamSyncedMeta(EntityStreamSyncedMetaKey.Buffs);
        if (!buffs) {
            return;
        }

        for (const buffType of buffs) {
            const handler = this.buffHandlerService.findBuffHandler(buffType);
            if (handler) {
                await handler.onTick(entity);
            }
        }
    }
}
