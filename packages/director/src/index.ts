import { app } from './app';
import { PORT } from './config';
import '@src/lib/hooks/init';
import '@src/lib/scheduler/init';

async function main() {
  app.on('error', (error) => {
    throw error;
  });
  app.listen(PORT, () => {
    console.log(`🚀 Director service is ready at http://0.0.0.0:${PORT}/...`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export * from './types';
