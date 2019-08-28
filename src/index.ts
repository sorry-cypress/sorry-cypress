import { app } from './app';
import { init } from './lib/mongo';

const PORT = process.env.PORT || 1234;

async function main() {
  await init();
  app.on('error', error => {
    throw error;
  });
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
