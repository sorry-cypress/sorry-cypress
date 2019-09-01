import { statefulMongoExecutionDriver } from 'execution/mongo/driver';
import { inMemoryExecutionDriver } from 'execution/in-memory';

import { S3ScreenshotsDriver } from 'screenshots/s3.driver';

export const executionDriver = inMemoryExecutionDriver;
export const screenshotsDriver = S3ScreenshotsDriver;
