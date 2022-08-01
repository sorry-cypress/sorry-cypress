import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { AssetUploadInstruction } from '@sorry-cypress/common';
import {
  AZURE_CONNEXION_STRING,
  AZURE_CONTAINER_NAME,
  AZURE_UPLOAD_URL_EXPIRY_IN_HOURS,
} from '@sorry-cypress/director/screenshots/azure-blob-storage/config';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_CONNEXION_STRING
);

interface GetUploadURLParams {
  key: string;
  ContentType?: string;
}

const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

export const getUploadUrl = async ({
  key,
  ContentType = ImageContentType,
}: GetUploadURLParams): Promise<AssetUploadInstruction> => {
  const signedUploadUrlStartsOn = new Date();
  const signedUploadUrlExpiresOn = new Date(
    signedUploadUrlStartsOn.getTime() +
      3600 * 1000 * AZURE_UPLOAD_URL_EXPIRY_IN_HOURS
  );
  const signedReadUrlStartsOn = new Date();
  const signedReadUrlExpiresOn = new Date(
    signedUploadUrlStartsOn.getTime() + 3600 * 1000 * 24 * 365 // Maximal duration for a SAS is 365 days. We can assume that no one will try to read a snapshot older than a year ago.
  );

  const uploadUrl = await blobServiceClient
    .getContainerClient(AZURE_CONTAINER_NAME)
    .getBlobClient(key)
    .generateSasUrl({
      permissions: BlobSASPermissions.parse('w'),
      startsOn: signedUploadUrlStartsOn,
      expiresOn: signedUploadUrlExpiresOn,
      contentType: ContentType,
    });
  const readUrl = await blobServiceClient
    .getContainerClient(AZURE_CONTAINER_NAME)
    .getBlobClient(key)
    .generateSasUrl({
      permissions: BlobSASPermissions.parse('r'),
      startsOn: signedReadUrlStartsOn,
      expiresOn: signedReadUrlExpiresOn,
      contentType: ContentType,
    });
  return { uploadUrl, readUrl };
};

export const getImageUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({ key: `${key}.png`, ContentType: ImageContentType });

export const getVideoUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${key}.mp4`,
    ContentType: VideoContentType,
  });
