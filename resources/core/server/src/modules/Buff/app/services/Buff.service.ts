import alt from 'alt-server';
import { Inject, Injectable } from '@altv-mango/core';
import { BUFF_CONFIG_BY_TYPE, type BuffType } from '@shared/common';
import { type ApplyBuffOptions, Buff, type IBuffService } from '../../domain';
import { EntityStreamSyncedMetaKey } from '@shared';
import { BuffHandlerService } from './BuffHandler.service';

@Injectable()
export class BuffService implements IBuffService {
    private readonly buffsByEntityMap = new Map<alt.Entity, Buff[]>();

    constructor(
        @Inject(BuffHandlerService)
        private readonly buffHandlerService: BuffHandlerService,
    ) {}

    public async applyBuff(entity: alt.Entity, buffType: BuffType, options?: ApplyBuffOptions): Promise<void> {
        const config = BUFF_CONFIG_BY_TYPE.get(buffType);
        if (!config) {
            throw new Error(`Not found buff config by type: ${buffType}`);
        }

        if (!config.validEntityTypes.includes(entity.type)) {
            throw new Error(`Buff ${buffType} can not be applied on entity with type ${entity.type}`);
        }

        const entityBuffs = this.buffsByEntityMap.get(entity) ?? [];
        const existedBuff = entityBuffs.find((buff) => buff.type === buffType);
        const handler = this.buffHandlerService.getBuffHandler(buffType);

        if (existedBuff && config.stackOptions?.maxStack !== undefined) {
            let stacksToAdd = options?.stacks ?? 1;
            if (config.stackOptions.maxStack !== null) {
                stacksToAdd = Math.min(stacksToAdd, config.stackOptions.maxStack - existedBuff.stacks);
            }

            existedBuff.updateStacks(existedBuff.stacks + stacksToAdd);
            handler.onStackUpdate(entity, existedBuff);
        }

        const expireAt = config.timerOptions ? new Date(Date.now() + config.timerOptions.durationMs) : undefined;
        if (existedBuff && expireAt) {
            existedBuff.updateExpireAt(expireAt);
        }

        if (!existedBuff) {
            const buff = new Buff({
                type: buffType,
                appliedAt: new Date(),
                stacks: options?.stacks ?? 1,
                expireAt,
                source: options?.source,
            });

            entityBuffs.push(buff);
            this.buffsByEntityMap.set(entity, entityBuffs);

            this.updateEntitySyncedMeta(entity);

            await handler.onApply(entity, buff);
        }

        alt.log(`Buff ${buffType} applied on entity with type ${entity.type} and id ${entity.id}`);
    }

    public async removeBuff(entity: alt.Entity, buffType: BuffType): Promise<void> {
        const entityBuffs = this.buffsByEntityMap.get(entity);
        if (!entityBuffs) {
            return;
        }

        const buffIdx = entityBuffs.findIndex((buff) => buff.type === buffType);
        const buff = entityBuffs[buffIdx];
        if (!buff) {
            return;
        }

        entityBuffs.splice(buffIdx, 1);

        const handler = this.buffHandlerService.getBuffHandler(buffType);
        await handler.onRemove(entity, buff);

        this.updateEntitySyncedMeta(entity);

        alt.log(`Buff ${buffType} remove from entity with type ${entity.type} and id ${entity.id}`);
    }

    public deleteEntityBuffs(entity: alt.Entity): void {
        this.buffsByEntityMap.delete(entity);
    }

    public hasBuff(entity: alt.Entity, buffType: BuffType): boolean {
        const entityBuffs = this.getBuffs(entity);
        return entityBuffs.some((buff) => buff.type === buffType);
    }

    public getBuffs(entity: alt.Entity): ReadonlyArray<Buff> {
        return this.buffsByEntityMap.get(entity) ?? [];
    }

    public getAllBuffs(): ReadonlyMap<alt.Entity, ReadonlyArray<Buff>> {
        return this.buffsByEntityMap;
    }

    private updateEntitySyncedMeta(entity: alt.Entity) {
        const buffs = this.getBuffs(entity);
        entity.setStreamSyncedMeta(
            EntityStreamSyncedMetaKey.Buffs,
            buffs.map((buff) => buff.type),
        );
    }
}
