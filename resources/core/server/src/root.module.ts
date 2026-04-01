import { Module } from '@altv-mango/server';
import { BuffModule, TestModule } from './modules';

@Module({
    imports: [BuffModule, TestModule],
})
export class RootModule {}
