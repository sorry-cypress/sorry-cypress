export const AZURE_CONNEXION_STRING = process.env.AZURE_CONNEXION_STRING || '';
export const AZURE_CONTAINER_NAME =
  process.env.AZURE_CONTAINER_NAME || 'sorry-cypress';
export const AZURE_UPLOAD_URL_EXPIRY_IN_HOURS = parseInt(
  process.env.AZURE_UPLOAD_URL_EXPIRY_IN_HOURS || '24'
);

export const UPLOAD_EXPIRY_SECONDS = Number(
  process.env.UPLOAD_EXPIRY_SECONhDS || '90'
);
