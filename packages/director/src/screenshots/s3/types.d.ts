export interface S3SignedUploadResult {
  uploadUrl: string;
  readUrl: string;
}

export interface S3SignedDownloadResult {
  downloadUrl: string;
}
