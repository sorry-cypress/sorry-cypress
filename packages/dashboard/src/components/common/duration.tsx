import { RenderOnInterval } from '@src/components/';
import { getSecondsDuration } from '@src/lib/duration';
import { Text } from 'bold-ui';
import { differenceInSeconds, parseISO } from 'date-fns';
import React from 'react';

export function Duration({
  completed,
  createdAtISO,
  wallClockDurationSeconds,
  hasCompletion,
}: {
  hasCompletion: boolean;
  completed: boolean;
  createdAtISO: string;
  wallClockDurationSeconds: number;
}) {
  if (completed || !hasCompletion) {
    return <Text>{getSecondsDuration(wallClockDurationSeconds)}</Text>;
  }

  return (
    <Text>
      <RenderOnInterval
        render={() =>
          getSecondsDuration(
            differenceInSeconds(Date.now(), parseISO(createdAtISO))
          )
        }
      />
    </Text>
  );
}
