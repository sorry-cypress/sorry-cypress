import { getRunSummary } from '@sorry-cypress/common';
import {
  CiUrl,
  FlexRow,
  FormattedDate,
  HeaderLink,
  Paper,
} from '@src/components/';
import {
  RunSummaryMetaFragment,
  RunSummarySpecFragment,
} from '@src/generated/graphql';
import { getSecondsDuration } from '@src/lib/duration';
import { theme } from '@src/theme';
import { Cell, Grid, Icon, Text, Tooltip, useCss } from 'bold-ui';
import { compact } from 'lodash';
import React from 'react';
import { Commit } from '../commit';
import { DeleteRunButton } from '../deleteRun/deleteRunButton';

type RunSummaryProps = {
  runSpecs: RunSummarySpecFragment[];
  runCreatedAt: string;
  runMeta: RunSummaryMetaFragment;
  runId: string;
};

export function RunSummary({
  runSpecs,
  runMeta,
  runId,
  runCreatedAt,
}: RunSummaryProps) {
  const { css } = useCss();
  const centeredIconClassName = css(`{
    display: flex;
    align-items: center;
  }`);

  const runSummary = getRunSummary(
    compact(runSpecs.map((s) => s.results?.stats))
  );

  return (
    <Paper>
      <FlexRow>
        <HeaderLink to={`/run/${runId}`}>{runMeta.ciBuildId}</HeaderLink>
        <DeleteRunButton runId={runId} ciBuildId={runMeta.ciBuildId} />
      </FlexRow>
      <Grid>
        <Cell xs={12} md={6}>
          <div>
            <Text>
              Started At: <FormattedDate value={new Date(runCreatedAt)} />
            </Text>
          </div>
          <div>
            <Text>
              Duration:{' '}
              {runSummary.wallClockDuration ? (
                <Text>{getSecondsDuration(runSummary.wallClockDuration)}</Text>
              ) : null}
              {/* {runSummary.wallClockStartedAt ? (
                <Text>
                  <RenderOnInterval
                    live
                    refreshIntervalInSeconds={1}
                    renderChild={() => {
                      return `${shortEnglishHumanizerWithMsIfNeeded(
                        Date.now() -
                          new Date(runSummary.wallClockStartedAt).getTime()
                      )}`;
                    }}
                  />
                </Text>
              ) : null} */}
            </Text>
          </div>
          <div style={{ display: 'flex' }}>
            <Text style={{ marginRight: '10px' }}>
              <Tooltip text="Total Tests">
                <span className={centeredIconClassName}>
                  <Icon icon="fileWithItensOutline" size={1} />
                  {runSummary.tests}
                </span>
              </Tooltip>
            </Text>
            <Text color="success" style={{ marginRight: '10px' }}>
              <Tooltip text="Successful">
                <span className={centeredIconClassName}>
                  <Icon icon="checkCircleOutline" size={1} />
                  {runSummary.passes}
                </span>
              </Tooltip>
            </Text>
            <Text
              color={runSummary.failures ? 'danger' : 'normal'}
              style={{ marginRight: '10px' }}
            >
              <Tooltip text="Failed">
                <span className={centeredIconClassName}>
                  <Icon icon="exclamationTriangleOutline" size={1} />
                  {runSummary.failures}
                </span>
              </Tooltip>
            </Text>
            <Text
              color={runSummary.pending ? 'disabled' : 'normal'}
              style={{ marginRight: '10px' }}
            >
              <Tooltip text="Skipped Tests">
                <span className={centeredIconClassName}>
                  <Icon icon="timesOutline" size={1} />
                  {runSummary.pending}
                </span>
              </Tooltip>
            </Text>
          </div>

          <div style={{ marginTop: theme.sizes.text }}>
            <strong>Spec files</strong>
            <ul>
              <li>Overall: {runSpecs.length}</li>
              <li>Claimed: {runSpecs.filter((s) => s.claimed).length}</li>
            </ul>
          </div>
        </Cell>
        <Cell xs={12} md={6}>
          <Commit commit={runMeta?.commit} />
          <CiUrl
            ciBuildId={runMeta?.ciBuildId}
            projectId={runMeta?.projectId}
          />
        </Cell>
      </Grid>
    </Paper>
  );
}
