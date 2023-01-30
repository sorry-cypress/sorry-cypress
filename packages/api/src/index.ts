// organize-imports-ignore
import 'source-map-support/register';
import { start } from './app';
import { HOST, PORT, APOLLO_PLAYGROUND, BASE_PATH } from './config';


start(HOST, PORT, BASE_PATH, APOLLO_PLAYGROUND).catch((error) => {
  console.error(error);
  process.exit(1);
});
