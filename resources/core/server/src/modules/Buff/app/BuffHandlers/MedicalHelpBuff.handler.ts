import alt from 'alt-server';
import { BuffType, MEDICAL_HELP_BUFF_INCREASE_PER_STACK, MEDICAL_HELP_BUFF_RADIUS_FOR_STACK_INCREASE } from '@shared';
import { Inject } from '@altv-mango/core';
import { BuffHandler } from '../decorators';
import { Buff, type IBuffHandler, IBuffService } from '../../domain';

@BuffHandler(BuffType.MedicalHelp)
export class MedicalHelpBuffHandler implements IBuffHandler<alt.Player> {
    constructor(
        @Inject(IBuffService)
        private readonly buffService: IBuffService,
    ) {}

    public onApply(_entity: alt.Player, _buff: Buff): void {}

    public onRemove(_entity: alt.Player, _buff: Buff): void {}

    public async onTick(player: alt.Player, buff: Buff): Promise<void> {
        const nearbyPlayersAmount = this.getNearbyPlayersAmount(player);
        if (nearbyPlayersAmount > 0) {
            await this.buffService.applyBuff(player, BuffType.MedicalHelp, {
                stacks: nearbyPlayersAmount,
            });
        }

        const increasedHealth = player.health + buff.stacks * MEDICAL_HELP_BUFF_INCREASE_PER_STACK;
        player.health = Math.min(increasedHealth, player.maxHealth);
    }

    public onStackUpdate(_entity: alt.Player, _buff: Buff): void {}

    private getNearbyPlayersAmount(targetPlayer: alt.Player): number {
        const players = alt.Player.all;
        const position = targetPlayer.pos;

        return players.filter(
            (player) => player.pos.distanceTo(position) <= MEDICAL_HELP_BUFF_RADIUS_FOR_STACK_INCREASE,
        ).length;
    }
}
