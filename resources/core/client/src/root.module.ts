import { Module } from '@altv-mango/client';
import { BuffModule, DebugModule } from './modules';

@Module({
    imports: [BuffModule, DebugModule],
})
export class RootModule {}
