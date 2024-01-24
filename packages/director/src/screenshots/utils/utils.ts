import { InstanceResult } from '@sorry-cypress/common/instance/types';
import { isInstanceFailed } from '@sorry-cypress/director/lib/results';

export const sanitizeS3KeyPrefix = (prefix?: string): string => {
  if (!prefix) {
    return '';
  }

  if (typeof prefix !== 'string') {
    return '';
  }

  if (!prefix.trim()) {
    return '';
  }
  let sanitizedPrefix = prefix.trim().replace(/(\/\/+)/g, '/');

  if (sanitizedPrefix.startsWith('/')) {
    sanitizedPrefix = sanitizedPrefix.substring(1);
  }
  if (sanitizedPrefix.endsWith('/')) {
    return sanitizedPrefix;
  }
  return sanitizedPrefix + '/';
};

// Function that decides based on the result if a video url should be generated
export const shouldGenerateVideoUrl = (result: InstanceResult): boolean => {
  // The Cypress config has videos deactivated
  if (!result.cypressConfig?.video) {
    return false;
  }
  // The Cypress Runner (Client) tells us, that no videos are available
  if (!result.video) {
    return false;
  }
  // Cypress < 13 logic (checked by validating that videoUploadOnPasses is not "undefined")
  if (result.cypressConfig.videoUploadOnPasses !== undefined) {
    // The instance has no error and videoUploadOnPasses is false
    if (
      !isInstanceFailed(result) &&
      !result.cypressConfig.videoUploadOnPasses
    ) {
      return false;
    }
  }
  return true;
};
