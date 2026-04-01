import { Module } from '@altv-mango/server';
import { BuffModule } from '../Buff';
import { TestController } from './Test.controller';

@Module({
    imports: [BuffModule],
    controllers: [TestController],
})
export class TestModule {}
