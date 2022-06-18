import { SetLocalStorageValue, useLocalStorage } from './useLocalStorage';

export enum ReadableSpecNamesKind {
  NameAsIs = 'NAME_AS_IS',
  ReadableName = 'READABLE_NAME',
  FullPath = 'FULL_PATH',
}

type ReturnValue = [
  ReadableSpecNamesKind,
  {
    setReadableSpecNames: SetLocalStorageValue<ReadableSpecNamesKind>;
    switchReadableSpecNames: () => void;
  }
];

export const useReadableSpecNames = () => {
  const [value, setValue] = useLocalStorage<ReadableSpecNamesKind>(
    'readableSpecNames',
    ReadableSpecNamesKind.NameAsIs
  );

  function switchReadableSpecNames() {
    switch (value) {
      case ReadableSpecNamesKind.FullPath:
        setValue(ReadableSpecNamesKind.NameAsIs);
        break;
      case ReadableSpecNamesKind.NameAsIs:
        setValue(ReadableSpecNamesKind.ReadableName);
        break;
      case ReadableSpecNamesKind.ReadableName:
        setValue(ReadableSpecNamesKind.FullPath);
    }
  }

  return [
    value,
    { setReadableSpecNames: setValue, switchReadableSpecNames },
  ] as ReturnValue;
};
