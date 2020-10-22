import { ScreenshotUploadInstruction } from './instance.types';

export interface UpdateInstanceResponse {
  videoUploadUrl?: string;
  screenshotUploadUrls: ScreenshotUploadInstruction[];
}
