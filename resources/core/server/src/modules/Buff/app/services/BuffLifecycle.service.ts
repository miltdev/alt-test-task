import alt from 'alt-server';
import { Inject, Injectable } from '@altv-mango/core';
import { BUFF_CONFIG_BY_TYPE, BUFF_DEFAULT_TICK_INTERVAL_MS, BuffType } from '@shared';
import { BuffHandlerService } from './BuffHandler.service';
import { Buff, IBuffService } from '../../domain';
import { BuffService } from './Buff.service';

@Injectable()
export class BuffLifecycleService {
    constructor(
        @Inject(IBuffService)
        private readonly buffService: BuffService,
        @Inject(BuffHandlerService)
        private readonly buffHandlerService: BuffHandlerService,
    ) {}

    public async tickBuffs() {
        const allEntitiesWithBuffs = this.buffService.getAllBuffs().entries();
        const promiseResults = await Promise.allSettled(
            allEntitiesWithBuffs.map(([entity, buffs]) => this.tickEntityBuffs(entity, buffs)),
        );

        for (const result of promiseResults) {
            if (result.status === 'rejected') {
                alt.logError('Buff tick failed with error: ', result.reason);
            }
        }
    }

    private async tickEntityBuffs(entity: alt.Entity, buffs: ReadonlyArray<Buff>) {
        if (!entity.valid) {
            this.buffService.deleteEntityBuffs(entity);

            return;
        }

        const now = Date.now();
        const buffsToTick: Buff[] = [];
        const buffTypesToRemove: BuffType[] = [];

        for (const buff of buffs) {
            const config = BUFF_CONFIG_BY_TYPE.get(buff.type);
            if (!config) {
                throw new Error(`Not found buff config by type: ${buff.type}`);
            }

            const tickIntervalMs = config.tickIntervalMs ?? BUFF_DEFAULT_TICK_INTERVAL_MS;
            const isMustTicked = now - buff.lastTickedAtTimestamp >= tickIntervalMs;
            if (isMustTicked) {
                buffsToTick.push(buff);
            }

            if (buff.expireAt && buff.expireAt.getTime() < now) {
                buffTypesToRemove.push(buff.type);
            }
        }

        await Promise.all(
            buffsToTick.map((buff) => {
                buff.updateLastTickedAtTimestamp(now);

                const handler = this.buffHandlerService.getBuffHandler(buff.type);
                return handler.onTick(entity, buff);
            }),
        );

        await Promise.all(buffTypesToRemove.map((buffType) => this.buffService.removeBuff(entity, buffType)));
    }
}
