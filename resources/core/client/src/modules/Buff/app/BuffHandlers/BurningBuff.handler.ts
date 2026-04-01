import alt from 'alt-client';
import { BuffType, BURNING_BUFF_PARTICLE_FX } from '@shared';
import type { IBuffHandler } from '../../domain';
import { BuffHandler } from '../decorators';
import * as natives from 'natives';

@BuffHandler(BuffType.Burning)
export class BurningBuffHandler implements IBuffHandler {
    private readonly fireParticleFxByEntity = new Map<alt.Entity, number>();

    public async onApply(entity: alt.Entity): Promise<void> {
        if (!natives.hasNamedPtfxAssetLoaded(BURNING_BUFF_PARTICLE_FX.asset)) {
            natives.requestNamedPtfxAsset(BURNING_BUFF_PARTICLE_FX.asset);
            await alt.Utils.waitFor(() => natives.hasNamedPtfxAssetLoaded(BURNING_BUFF_PARTICLE_FX.asset));
        }

        if (!entity.scriptID) {
            return;
        }

        natives.useParticleFxAsset(BURNING_BUFF_PARTICLE_FX.asset);
        const fireParticleFx = natives.startParticleFxLoopedOnEntity(
            BURNING_BUFF_PARTICLE_FX.name,
            entity.scriptID,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            true,
            true,
            true,
        );
        this.fireParticleFxByEntity.set(entity, fireParticleFx);
    }

    public onRemove(entity: alt.Entity): void {
        const fireParticleFx = this.fireParticleFxByEntity.get(entity);
        if (!fireParticleFx) {
            return;
        }

        natives.removeParticleFx(fireParticleFx, true);
    }

    public onTick(_entity: alt.Entity): void {}
}
