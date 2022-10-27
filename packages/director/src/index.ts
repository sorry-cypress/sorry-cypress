// organize-imports-ignore
import 'source-map-support/register'

import { init as initHooks } from '@sorry-cypress/director/lib/hooks/init';
import { getLogger } from '@sorry-cypress/logger';
import { app } from './app';
import { PORT } from './config';
import { getExecutionDriver, getScreenshotsDriver } from './drivers';

async function main() {
  await initHooks();
  await getExecutionDriver();
  await getScreenshotsDriver();

  app.on('error', (error) => {
    throw error;
  });
  app.listen(PORT, async () => {
    getLogger().log(
      `🚀 Director service is ready at http://0.0.0.0:${PORT}/...`
    );
  });
}

app.disable('x-powered-by');

process.on('uncaughtException', (err) => {
  console.error(err, 'uncaughtException');
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(err, 'unhandledRejection');
  process.exit(1);
});

main().catch(async (error) => {
  getLogger().error(error);
  process.exit(1);
});

export * from './types';
