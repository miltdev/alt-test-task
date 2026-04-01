import { Module } from '@altv-mango/server';
import { BuffController } from './infrastructure';
import { IBuffService } from './domain';
import { BuffHandlers, BuffHandlerService, BuffLifecycleService, BuffService } from './app';

@Module({
    controllers: [BuffController],
    providers: [
        ...BuffHandlers,
        {
            provide: IBuffService,
            useClass: BuffService,
        },
        BuffHandlerService,
        BuffLifecycleService,
    ],
    exports: [IBuffService],
})
export class BuffModule {}
