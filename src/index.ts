import { app } from './app';
import { getExecutionDriver, getScreenshotsDriver } from '@src/drivers';
import { PORT } from './config';

async function main() {
  const executionDriver = await getExecutionDriver();
  console.log(`Initializing "${executionDriver.id}" execution driver...`);
  await executionDriver.init();

  const screenshotsDriver = await getScreenshotsDriver();
  console.log(`Initializing "${screenshotsDriver.id}" screenshots driver...`);
  await screenshotsDriver.init();

  app.set('executionDriver', executionDriver);
  app.set('screenshotsDriver', screenshotsDriver);
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
