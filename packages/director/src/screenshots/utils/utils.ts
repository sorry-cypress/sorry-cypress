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
