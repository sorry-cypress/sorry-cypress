import { init as initHooks } from '@sorry-cypress/director/lib/hooks/init';
import { app } from './app';
import { PORT } from './config';
import { getExecutionDriver, getScreenshotsDriver } from './drivers';

async function main() {
  app.on('error', (error) => {
    throw error;
  });
  app.listen(PORT, async () => {
    console.log(`🚀 Director service is ready at http://0.0.0.0:${PORT}/...`);
    await initHooks();
    await getExecutionDriver();
    await getScreenshotsDriver();
  });
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});

export * from './types';
