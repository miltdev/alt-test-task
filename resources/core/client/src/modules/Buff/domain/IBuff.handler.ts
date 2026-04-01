import type { MaybePromise } from '@shared';
import alt from 'alt-client';

export interface IBuffHandler<TEntity extends alt.Entity = alt.Entity> {
    onApply(entity: TEntity): MaybePromise<void>;
    onRemove(entity: TEntity): MaybePromise<void>;
    onTick(entity: TEntity): MaybePromise<void>;
}
