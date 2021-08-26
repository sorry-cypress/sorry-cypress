import { RenderOnInterval } from '@sorry-cypress/dashboard/components/';
import { RunCompletion } from '@sorry-cypress/dashboard/generated/graphql';
import { getSecondsDuration } from '@sorry-cypress/dashboard/lib/duration';
import { Text } from 'bold-ui';
import { differenceInSeconds, parseISO } from 'date-fns';
import { differenceInHours } from 'date-fns/esm';
import React from 'react';

export const IDLE_TIMEOUT_HOURS = 2;
export function isIdle(isoDate: string) {
  return differenceInHours(new Date(), parseISO(isoDate)) > IDLE_TIMEOUT_HOURS;
}

export function Duration({
  createdAtISO,
  completion,

  wallClockDurationSeconds,
}: {
  completion?: RunCompletion;
  createdAtISO: string;
  wallClockDurationSeconds: number;
}) {
  if (completion?.completed || isIdle(createdAtISO)) {
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
