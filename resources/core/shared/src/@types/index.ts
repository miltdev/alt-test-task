import { EntityStreamSyncedMetaKey } from '../sync';
import { BuffType } from '../common';

declare module 'alt-shared' {
    export interface ICustomEntityStreamSyncedMeta {
        [EntityStreamSyncedMetaKey.Buffs]: BuffType[];
    }
}
