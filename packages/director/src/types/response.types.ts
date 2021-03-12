import { ScreenshotUploadInstruction } from '@sorry-cypress/common';

export interface UpdateInstanceResponse {
  videoUploadUrl?: string;
  screenshotUploadUrls: ScreenshotUploadInstruction[];
}
