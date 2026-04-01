import '@shared/@types';
import '@abraham/reflection';
import { RootModule } from './root.module';
import { createAppBuilder } from '@altv-mango/client';
import alt from 'alt-client';

async function bootstrap(): Promise<void> {
    const appBuilder = await createAppBuilder();
    const app = await appBuilder.build();
    await app.start(RootModule);
}

bootstrap()
    .then(() => alt.log('Bootstraped'))
    .catch((err) => {
        alt.logError(`Error on bootstrap: ${err}`);
    });
