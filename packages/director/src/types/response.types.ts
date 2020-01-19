import { ScreenshotUploadInstruction } from './instance.types';

export interface UpdateInstanseResponse {
  videoUploadUrl?: string;
  screenshotUploadUrls: ScreenshotUploadInstruction[];
}
