export interface Screenshot {
  screenshotId: string;
  name: string | null;
  testId: string;
  takenAt: string;
  height: number;
  width: number;
}
export interface InstanceResult {
  screenshots: Screenshot[];
}

export interface S3SignedUploadResult {
  uploadUrl: string;
  readUrl: string;
}
export interface ScreenshotUploadInstruction extends S3SignedUploadResult {
  screenshotId: string;
}
