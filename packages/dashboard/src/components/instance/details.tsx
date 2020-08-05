import { DataTable, Link, Text, Tooltip, useCss } from 'bold-ui';
import React from 'react';
import { generatePath } from 'react-router-dom';
import { Instance, InstanceTest } from '../../generated/graphql';
import { shortEnglishHumanizerWithMsIfNeeded } from '../../lib/utis';
import { TestState } from '../common';

export const InstanceDetails: React.FC<{ instance: Instance }> = ({
  instance,
}: {
  instance: Instance;
}) => {
  const { css } = useCss();
  if (!instance.results) {
    return <p>No results yet for the spec</p>;
  }
  const tests = instance.results.tests;

  if (!tests) {
    return <div>No tests reported for spec</div>;
  }
  /* eslint-disable react/display-name */
  return (
    <div>
      <strong>Tests</strong>
      <div
        className={css`
           {
            margin: 12px 0;
          }
        `}
      >
        <DataTable
          rows={tests}
          loading={false}
          columns={[
            {
              name: 'status',
              header: 'Status',
              sortable: false,
              render: (test: InstanceTest) => <TestState state={test.state} />,
            },
            {
              name: 'duration',
              header: 'Duration',
              sortable: false,
              render: (test: InstanceTest) => {
                if (test?.wallClockDuration) {
                  return (
                    <Tooltip text={`Started at ${test.wallClockStartedAt}`}>
                      <Text>
                        {shortEnglishHumanizerWithMsIfNeeded(
                          test.wallClockDuration
                        )}
                      </Text>
                    </Tooltip>
                  );
                } else {
                  return '';
                }
              },
            },
            {
              name: 'link',
              header: '',
              sortable: false,
              render: (test: InstanceTest) => (
                <Link
                  href={generatePath(
                    `/instance/${instance?.instanceId}/test/${test.testId}`
                  )}
                >
                  {test.title?.join(' > ')}
                </Link>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
