import { init as initHooks } from '@src/lib/hooks/init';
import {
  init as initInactivityTimeout,
  shutdown,
} from '@src/lib/scheduler/init';
import { app } from './app';
import { PORT } from './config';

async function main() {
  app.on('error', (error) => {
    throw error;
  });
  app.listen(PORT, async () => {
    console.log(`🚀 Director service is ready at http://0.0.0.0:${PORT}/...`);
    await initInactivityTimeout();
    await initHooks();
  });
}

process.on('SIGABRT', async () => {
  await shutdown();
});

main().catch(async (error) => {
  await shutdown();
  console.error(error);
  process.exit(1);
});

export * from './types';
