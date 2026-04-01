import type { MaybePromise } from '@shared';
import type { Buff } from './Buff';
import alt from 'alt-server';

export interface IBuffHandler<TEntity extends alt.Entity = alt.Entity> {
    onApply(entity: TEntity, buff: Buff): MaybePromise<void>;
    onRemove(entity: TEntity, buff: Buff): MaybePromise<void>;
    onTick(entity: TEntity, buff: Buff): MaybePromise<void>;
    onStackUpdate(entity: TEntity, buff: Buff): void;
}
