import alt from 'alt-server';
import { ARMOR_REGEN_BUFF_INCREASE_PER_STACK, BuffType } from '@shared';
import type { Buff, IBuffHandler } from '../../domain';
import { BuffHandler } from '../decorators';

@BuffHandler(BuffType.ArmorRegen)
export class ArmorRegenBuffHandler implements IBuffHandler<alt.Player> {
    public onApply(_entity: alt.Player, _buff: Buff): void {}

    public onRemove(_entity: alt.Player, _buff: Buff): void {}

    public onTick(player: alt.Player, buff: Buff): void {
        const increasedArmour = player.armour + buff.stacks * ARMOR_REGEN_BUFF_INCREASE_PER_STACK;
        player.armour = Math.min(increasedArmour, player.maxArmour);
    }

    public onStackUpdate(_entity: alt.Player, _buff: Buff): void {}
}
