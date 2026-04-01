import { BuffType } from '@shared';
import type { Buff } from './Buff';
import type { BuffSource } from './BuffSource.type';
import alt from 'alt-server';

export interface ApplyBuffOptions {
    source?: BuffSource;
    stacks?: number;
}

export interface IBuffService {
    applyBuff(entity: alt.Entity, buffType: BuffType, options?: ApplyBuffOptions): Promise<void>;
    removeBuff(entity: alt.Entity, buffType: BuffType): Promise<void>;
    hasBuff(entity: alt.Entity, buffType: BuffType): boolean;
    getBuffs(entity: alt.Entity): ReadonlyArray<Buff>;
    getAllBuffs(): ReadonlyMap<alt.Entity, ReadonlyArray<Buff>>;
}

export const IBuffService: unique symbol = Symbol('IBuffService');
