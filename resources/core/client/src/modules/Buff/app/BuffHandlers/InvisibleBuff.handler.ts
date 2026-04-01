import alt from 'alt-client';
import * as natives from 'natives';
import { BuffType } from '@shared';
import type { IBuffHandler } from '../../domain';
import { BuffHandler } from '../decorators';

@BuffHandler(BuffType.Invisible)
export class InvisibleBuffHandler implements IBuffHandler<alt.Player | alt.Ped> {
    public onApply(entity: alt.Player | alt.Ped): Promise<void> {
        return this.transitAlphaSmoothly(entity, 255, 52);
    }

    public async onRemove(entity: alt.Player | alt.Ped): Promise<void> {
        if (!entity.scriptID) {
            return;
        }

        return this.transitAlphaSmoothly(entity, 52, 255);
    }

    public onTick(_entity: alt.Player | alt.Ped): void {}

    private async transitAlphaSmoothly(
        entity: alt.Player | alt.Ped,
        fromAlpha: number,
        targetAlpha: number,
    ): Promise<void> {
        const step = fromAlpha > targetAlpha ? -1 : 1;

        while (natives.getEntityAlpha(entity.scriptID) !== targetAlpha) {
            const nextAlpha = natives.getEntityAlpha(entity.scriptID) + step;

            natives.setEntityAlpha(entity.scriptID, nextAlpha, false);
            await alt.Utils.wait(10);

            if (!entity.scriptID) {
                return;
            }
        }
    }
}
