export function getBase(
  path: string,
  options = { removeExtension: true, easyToRead: true }
) {
  let base = path.replace(/^.*[\\/]/, '') || path || '';
  if (options.removeExtension) {
    base = base.replace(/\..*$/, '');
  }
  if (options.easyToRead) {
    base = base.replace(/[^a-zA-Z0-9]/g, ' ');
  }

  return base;
}
