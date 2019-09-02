import { statefulMongoExecutionDriver } from '@src/execution/mongo/driver';
import { inMemoryExecutionDriver } from '@src/execution/in-memory';

import { S3ScreenshotsDriver } from '@src/screenshots/s3.driver';

export const executionDriver = inMemoryExecutionDriver;
export const screenshotsDriver = S3ScreenshotsDriver;
