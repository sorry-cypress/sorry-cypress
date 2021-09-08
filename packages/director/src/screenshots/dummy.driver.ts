import { ScreenshotsDriver } from '@sorry-cypress/director/types';

export const driver: ScreenshotsDriver = {
  id: 'dummy',
  init: () => Promise.resolve(),
  getScreenshotsUploadUrls: async () => [],
  getVideoUploadUrl: async () => null,
};
