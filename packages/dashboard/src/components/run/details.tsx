import {
  DataTable,
  HFlow,
  Icon,
  Link,
  Switch,
  Text,
  Tooltip,
  useCss,
} from 'bold-ui';
import mean from 'lodash/mean';
import React, { useState } from 'react';
import { generatePath } from 'react-router-dom';
import { FullRunSpec, Run } from '../../generated/graphql';
import { getFullRunSpecState } from '../../lib/executionState';
import { shortEnglishHumanizerWithMsIfNeeded } from '../../lib/utis';
import { SpecState } from '../common';
import RenderOnInterval from '../renderOnInterval/renderOnInterval';

type RunDetailsProps = {
  run: Partial<Run>;
  propertySpecHeuristics: Record<string, number[]>;
};

export function RunDetails({
  run,
  propertySpecHeuristics = {},
}: RunDetailsProps) {
  const { css } = useCss();
  const { specs } = run;

  const [isPassedHidden, setHidePassedSpecs] = useState(false);

  if (!specs) {
    return null;
  }

  const centeredIconClassName = css(`{
    display: flex;
    align-items: center;
  }`);

  /* eslint-disable @typescript-eslint/no-non-null-assertion, react/display-name */
  return (
    <div>
      <HFlow justifyContent="space-between">
        <strong>Spec files</strong>
        <Switch
          label="Hide successful specs"
          onChange={() => setHidePassedSpecs(!isPassedHidden)}
        />
      </HFlow>
      <div
        className={css`
          {
            margin: 12px 0;
          }
        `}
      >
        <DataTable
          rows={specs
            .filter((spec) => !!spec)
            .filter((spec) =>
              isPassedHidden ? getFullRunSpecState(spec!) !== 'passed' : true
            )}
          loading={false}
          columns={[
            {
              name: 'status',
              header: 'Status',
              sortable: false,
              render: (spec: FullRunSpec) => (
                <SpecState state={getFullRunSpecState(spec)} />
              ),
            },
            {
              name: 'link',
              header: '',
              sortable: false,
              render: (spec: FullRunSpec) => (
                <Link href={generatePath(`/instance/${spec?.instanceId}`)}>
                  {spec?.spec}
                </Link>
              ),
            },
            {
              name: 'duration',
              header: 'Duration',
              sortable: false,
              render: (spec: FullRunSpec) => {
                if (spec?.results?.stats?.wallClockDuration) {
                  return (
                    <Tooltip
                      text={`Started at ${spec.results.stats.wallClockStartedAt}`}
                    >
                      <Text>
                        {shortEnglishHumanizerWithMsIfNeeded(
                          spec.results.stats.wallClockDuration
                        )}
                      </Text>
                    </Tooltip>
                  );
                } else if (spec?.claimedAt) {
                  return (
                    <Tooltip text={`Started at ${spec.claimedAt}`}>
                      <Text>
                        <RenderOnInterval
                          live
                          refreshIntervalInSeconds={1}
                          renderChild={() => {
                            return `${shortEnglishHumanizerWithMsIfNeeded(
                              Date.now() - new Date(spec.claimedAt!).getTime()
                            )}`;
                          }}
                        />
                      </Text>
                    </Tooltip>
                  );
                } else {
                  return '';
                }
              },
            },
            {
              name: 'average-duration',
              header: 'Average Duration',
              sortable: false,
              render: (spec: FullRunSpec) => {
                if (spec?.spec) {
                  return shortEnglishHumanizerWithMsIfNeeded(
                    mean(propertySpecHeuristics[spec?.spec] || [])
                  );
                }
              },
            },
            {
              name: 'failures',
              header: '',
              sortable: false,
              render: (spec) =>
                spec?.results?.stats?.failures ? (
                  <Text color="danger">
                    <Tooltip text="failed">
                      <span className={centeredIconClassName}>
                        <Icon icon="exclamationTriangleOutline" size={1} />
                        {spec.results.stats.failures}
                      </span>
                    </Tooltip>
                  </Text>
                ) : (
                  ''
                ),
            },
            {
              name: 'passes',
              header: '',
              sortable: false,
              render: (spec) =>
                spec?.results?.stats?.passes ? (
                  <Text color="success">
                    <Tooltip text="passed">
                      <span className={centeredIconClassName}>
                        <Icon icon="checkCircleOutline" size={1} />
                        {spec.results.stats.passes}
                      </span>
                    </Tooltip>
                  </Text>
                ) : (
                  ''
                ),
            },
            {
              name: 'skipped',
              header: '',
              sortable: false,
              render: (spec) =>
                spec?.results?.stats?.pending ? (
                  <Text>
                    <Tooltip text="skipped">
                      <span className={centeredIconClassName}>
                        <Icon icon="timesOutline" size={1} />
                        {spec.results.stats.pending}
                      </span>
                    </Tooltip>
                  </Text>
                ) : (
                  ''
                ),
            },
          ]}
        />
      </div>
    </div>
  );
}
