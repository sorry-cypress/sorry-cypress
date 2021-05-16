import { ScreenshotsDriver } from '@src/types';

export const driver: ScreenshotsDriver = {
  id: 'dummy',
  init: () => Promise.resolve(),
  getScreenshotsUploadUrls: async () => [],
  getVideoUploadUrl: async () => null,
};
