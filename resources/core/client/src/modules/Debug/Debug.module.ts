import { Module } from '@altv-mango/client';
import { DebugController } from './Debug.controller';

@Module({
    controllers: [DebugController],
})
export class DebugModule {}
