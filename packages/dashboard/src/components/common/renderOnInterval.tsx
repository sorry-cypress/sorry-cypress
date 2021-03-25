import React, { useEffect, useRef, useState } from 'react';

interface RenderOnIntervalProps {
  refreshIntervalInSeconds?: number;
  live?: boolean;
  render: () => React.ReactNode;
}
export const RenderOnInterval = ({
  refreshIntervalInSeconds = 1,
  live = true,
  render,
}: RenderOnIntervalProps) => {
  const setTick = useState([])[1];
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!live) {
      return;
    }
    setInterval(() => setTick([]), 1000 * refreshIntervalInSeconds);
    return () => intervalId.current && clearInterval(intervalId.current);
  }, [refreshIntervalInSeconds, live]);
  return <React.Fragment>{render()}</React.Fragment>;
};
