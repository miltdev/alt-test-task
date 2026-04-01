import alt from 'alt-client';
import { Body, Controller, Inject, Interval } from '@altv-mango/core';
import { BUFF_DEFAULT_TICK_INTERVAL_MS, EntityStreamSyncedMetaKey } from '@shared';
import { OnStreamSyncedMetaChange, OnWorldObjectStreamIn, OnWorldObjectStreamOut } from '@altv-mango/client';
import type { AltEventParams } from '@client/utils';
import { BuffLifecycleService, BuffService } from '../../app';

@Controller()
export class BuffController {
    constructor(
        @Inject(BuffLifecycleService)
        private readonly buffLifecycleService: BuffLifecycleService,
        @Inject(BuffService)
        private readonly buffService: BuffService,
    ) {}

    @Interval(BUFF_DEFAULT_TICK_INTERVAL_MS)
    public onBuffsTick(): Promise<void> {
        return this.buffLifecycleService.tickBuffs();
    }

    @OnStreamSyncedMetaChange()
    public async onStreamMetaChanged(
        @Body() [object, key, value, oldValue]: AltEventParams<'streamSyncedMetaChange'>,
    ): Promise<void> {
        if (!(object instanceof alt.Entity) || key !== EntityStreamSyncedMetaKey.Buffs) {
            return;
        }

        return this.buffService.handleEntityBuffsChanged(object, value, oldValue);
    }

    @OnWorldObjectStreamIn()
    public async onEntityStreamIn(@Body() [object]: AltEventParams<'worldObjectStreamIn'>): Promise<void> {
        if (!(object instanceof alt.Entity)) {
            return;
        }

        return this.buffService.handleEntityStreamIn(object);
    }

    @OnWorldObjectStreamOut()
    public async onEntityStreamOut(@Body() [object]: AltEventParams<'worldObjectStreamOut'>): Promise<void> {
        if (!(object instanceof alt.Entity)) {
            return;
        }

        return this.buffService.handleEntityStreamOut(object);
    }
}
