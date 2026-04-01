import alt from 'alt-client';
import {
    BuffType,
    CameraShakeType,
    DRUNK_BUFF_MOVEMENT_CLIPSET,
    DRUNK_BUFF_RAGDOLL_CHANCE,
    RagdollType,
} from '@shared';
import type { IBuffHandler } from '../../domain';
import { BuffHandler } from '../decorators';
import * as natives from 'natives';

@BuffHandler(BuffType.Drunk)
export class DrunkBuffHandler implements IBuffHandler<alt.Player> {
    public async onApply(player: alt.Player): Promise<void> {
        if (!natives.hasAnimDictLoaded(DRUNK_BUFF_MOVEMENT_CLIPSET)) {
            await alt.Utils.requestClipSet(DRUNK_BUFF_MOVEMENT_CLIPSET);
        }

        natives.setPedMovementClipset(player.scriptID, DRUNK_BUFF_MOVEMENT_CLIPSET, 1);

        if (player === alt.LocalPlayer.local) {
            natives.shakeGameplayCam(CameraShakeType.DRUNK_SHAKE, 2);
        }
    }

    public onRemove(player: alt.Player): void {
        if (!player.scriptID) {
            return;
        }

        natives.resetPedMovementClipset(player.scriptID, 0);

        if (player === alt.LocalPlayer.local) {
            natives.stopGameplayCamShaking(true);
        }
    }

    public onTick(player: alt.Player): void {
        if (player !== alt.LocalPlayer.local) {
            return;
        }

        const rnd = Math.random();
        if (rnd < DRUNK_BUFF_RAGDOLL_CHANCE) {
            natives.setPedToRagdoll(player.scriptID, 5000, 5000, RagdollType.Normal, true, true, false);
        }
    }
}
