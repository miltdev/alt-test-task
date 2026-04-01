import { BuffType } from '@shared';
import type { BuffSource } from './BuffSource.type';

interface BuffInput {
    type: BuffType;
    appliedAt: Date;
    stacks: number;
    expireAt?: Date;
    source?: BuffSource;
}

export class Buff {
    private readonly _type: BuffType;
    get type(): BuffType {
        return this._type;
    }

    private readonly _appliedAt: Date;
    get appliedAt(): Date {
        return this._appliedAt;
    }

    private _expireAt: Date | undefined;
    get expireAt(): Date | undefined {
        return this._expireAt;
    }

    private _stacks: number;
    get stacks(): number {
        return this._stacks;
    }

    private _lastTickedAtTimestamp: number = 0;
    get lastTickedAtTimestamp(): number {
        return this._lastTickedAtTimestamp;
    }

    constructor(data: BuffInput) {
        this._type = data.type;
        this._appliedAt = data.appliedAt;
        this._expireAt = data.expireAt;
        this._stacks = data.stacks;
    }

    public updateStacks(stacks: number) {
        if (stacks <= 0) {
            throw new Error('Stacks must be greater than 0');
        }

        this._stacks = stacks;
    }

    public updateExpireAt(expireAt: Date) {
        this._expireAt = expireAt;
    }

    public updateLastTickedAtTimestamp(timestamp: number) {
        this._lastTickedAtTimestamp = timestamp;
    }
}
