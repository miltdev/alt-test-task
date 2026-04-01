import { Module } from '@altv-mango/client';
import { BuffController } from './infrastructure';
import { BuffHandlers, BuffHandlerService, BuffLifecycleService, BuffService } from './app';

@Module({
    controllers: [BuffController],
    providers: [...BuffHandlers, BuffService, BuffHandlerService, BuffLifecycleService],
})
export class BuffModule {}
