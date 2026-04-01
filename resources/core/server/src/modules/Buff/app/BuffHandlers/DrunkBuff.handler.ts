import alt from 'alt-server';
import type { Buff, IBuffHandler } from '../../domain';
import { BuffHandler } from '../decorators';
import { BuffType } from '@shared';

@BuffHandler(BuffType.Drunk)
export class DrunkBuffHandler implements IBuffHandler {
    public onApply(_entity: alt.Entity, _buff: Buff): void {}

    public onRemove(_entity: alt.Entity, _buff: Buff): void {}

    public onTick(_entity: alt.Entity, _buff: Buff): void {}

    public onStackUpdate(_entity: alt.Entity, _buff: Buff): void {}
}
