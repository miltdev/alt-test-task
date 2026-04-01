import { Controller, Inject, Interval } from '@altv-mango/core';
import { BuffLifecycleService } from '../../app';
import { BUFF_DEFAULT_TICK_INTERVAL_MS } from '@shared';

@Controller()
export class BuffController {
    constructor(
        @Inject(BuffLifecycleService)
        private readonly buffLifecycleService: BuffLifecycleService,
    ) {}

    @Interval(BUFF_DEFAULT_TICK_INTERVAL_MS)
    public onBuffTick(): Promise<void> {
        return this.buffLifecycleService.tickBuffs();
    }
}
