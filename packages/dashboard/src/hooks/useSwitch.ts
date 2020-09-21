import { useState } from 'react';

type UseSwitch = [
  boolean,
  (value?: boolean) => void,
  {
    setSwitchTrue: () => void;
    setSwitchFalse: () => void;
  }
];
export const useSwitch = (initial = false): UseSwitch => {
  const [on, setOn] = useState<boolean>(initial);

  function toggleSwitch(value?: boolean) {
    setOn(value ?? !on);
  }

  function setSwitchTrue() {
    setOn(true);
  }
  function setSwitchFalse() {
    setOn(false);
  }

  return [on, toggleSwitch, { setSwitchTrue, setSwitchFalse }];
};
