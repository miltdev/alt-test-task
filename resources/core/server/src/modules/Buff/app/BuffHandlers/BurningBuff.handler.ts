import alt from 'alt-server';
import type { Buff, IBuffHandler } from '../../domain';
import { BuffHandler } from '../decorators';
import { BuffType, BURNING_BUFF_DECREASE_HEALTH_PER_TICK } from '@shared';

@BuffHandler(BuffType.Burning)
export class BurningBuffHandler implements IBuffHandler {
    public onApply(_entity: alt.Entity, _buff: Buff): void {}

    public onRemove(_entity: alt.Entity, _buff: Buff): void {}

    public onTick(entity: alt.Entity, _buff: Buff): void {
        if (entity instanceof alt.Player || entity instanceof alt.Ped) {
            const decreasedHealth = entity.health - BURNING_BUFF_DECREASE_HEALTH_PER_TICK;
            entity.health = Math.max(decreasedHealth, 0);
        }
    }

    public onStackUpdate(_entity: alt.Entity, _buff: Buff): void {}
}
