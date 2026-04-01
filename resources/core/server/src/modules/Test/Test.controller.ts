import { Body, Controller, Inject, type OnModuleInit } from '@altv-mango/core';
import { OnPlayer, OnPlayerConnect } from '@altv-mango/server';
import { IBuffService } from '../Buff';
import type { AltEventParams } from '@server/utils';
import alt from 'alt-server';
import { BuffType } from '@shared';

type BuffCommandEntityType = 'player' | 'vehicle' | 'ped';

@Controller()
export class TestController implements OnModuleInit {
    constructor(
        @Inject(IBuffService)
        private readonly buffService: IBuffService,
    ) {}

    public onModuleInit(): void {
        new alt.Vehicle('adder', new alt.Vector3(-12, 13, 71.1), new alt.Vector3(0, 0, 0));
        new alt.Vehicle('entityxf', new alt.Vector3(-13, 33, 71.1), new alt.Vector3(0, 0, 0));

        new alt.Ped('ig_amandatownley', new alt.Vector3(6, 26, 70.89), new alt.Vector3(0, 0, 0));
        new alt.Ped('s_m_m_armoured_01', new alt.Vector3(9, 19, 70.72), new alt.Vector3(0, 0, 0));
    }

    @OnPlayerConnect()
    public onPlayerConnected(@Body() [player]: AltEventParams<'playerConnect'>) {
        alt.logDebug(`Player connected ${player.socialClubName}`);
        player.model = 'mp_m_freemode_01';
        player.pos = new alt.Vector3(-7, 21, 71);
        player.frozen = false;
    }

    @OnPlayer('console::command')
    public async onBuffCommand(@Body() [name, ...args]: [string, ...string[]]): Promise<void> {
        const [entityType, rawEntityId, buffType] = args;
        if (!entityType || !rawEntityId || !buffType) {
            return;
        }

        const entityId = parseInt(rawEntityId);
        if (isNaN(entityId)) {
            return;
        }

        const entity = this.getEntityByTypeAndId(entityType as BuffCommandEntityType, entityId);
        if (!entity) {
            return;
        }

        if (!this.isBuffType(buffType)) {
            return;
        }

        if (name === 'add_buff') {
            await this.buffService.applyBuff(entity, buffType);
        } else if (name === 'remove_buff') {
            await this.buffService.removeBuff(entity, buffType);
        }
    }

    private getEntityByTypeAndId(type: BuffCommandEntityType, id: number): alt.Entity | null {
        switch (type) {
            case 'player':
                return alt.Player.getByID(id);
            case 'ped':
                return alt.Ped.getByID(id);
            case 'vehicle':
                return alt.Vehicle.getByID(id);
            default:
                throw new Error(`Unknown entity type ${type}`);
        }
    }

    private isBuffType(rawString: string): rawString is BuffType {
        return (Object.values(BuffType) as string[]).includes(rawString);
    }
}
