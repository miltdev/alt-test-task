import { Body, Controller, EveryTick } from '@altv-mango/core';
import alt from 'alt-client';
import type { AltEventParams } from '@client/utils';
import { OnConsoleCommand } from '@altv-mango/client';
import * as natives from 'natives';

@Controller()
export class DebugController {
    @EveryTick()
    public onRender() {
        const streamedEntities = [
            alt.LocalPlayer.local,
            ...alt.Player.streamedIn,
            ...alt.Vehicle.streamedIn,
            ...alt.Ped.streamedIn,
        ];
        for (const entity of streamedEntities) {
            alt.Utils.drawText3dThisFrame(
                `ID: ${entity.remoteID} HP: ${natives.getEntityHealth(entity.scriptID)}`,
                entity.pos,
                0,
                0.5,
            );
        }

        const localPlayerPos = alt.LocalPlayer.local.pos;
        alt.Utils.drawText2dThisFrame(JSON.stringify(localPlayerPos.toArray()), new alt.Vector2(0.5, 0.9), 0, 0.5);
    }

    @OnConsoleCommand()
    public async onBuffCommand(@Body() [name, ...args]: AltEventParams<'consoleCommand'>): Promise<void> {
        alt.log('OnConsoleCommand', name, args);
        alt.emitServer('console::command', [name, ...args]);
    }
}
