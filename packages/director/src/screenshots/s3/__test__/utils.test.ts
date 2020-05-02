import { sanitizeS3KeyPrefix } from '../utils';

describe('sanitizeS3KeyPrefix()', () => {
  it.each([
    ['//some//path', 'some/path/'],
    ['/some/path/', 'some/path/'],
    ['  //some//path', 'some/path/'],
    ['  //some//path  ', 'some/path/'],
    ['  //some//path//  ', 'some/path/'],
    ['/some/path/', 'some/path/'],
    ['some/path//', 'some/path/'],
    ['some/path//', 'some/path/'],
    ['some/path', 'some/path/'],
    ['some/path/', 'some/path/'],
    ['////some/path', 'some/path/'],
    ['/', '/'],
    ['/////', '/'],
    ['path/////', 'path/'],
    ['////path/////', 'path/'],
    ['', ''],
    [' ', ''],
    [null, ''],
    [undefined, ''],
    [(42 as unknown) as string, ''],
    [([42] as unknown) as string, ''],
  ])('sanitizes "%s" to "%s"', (actual, expected) => {
    expect(sanitizeS3KeyPrefix(actual)).toEqual(expected);
  });
});
