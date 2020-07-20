import React from 'react';
import { generatePath } from 'react-router-dom';
import { Test, CorruptedTest } from '../test';

import { useCss, DataTable, Link, Text, Tooltip} from 'bold-ui';
import { TestState } from '../common';
import { shortEnglishHumanizerWithMsIfNeeded,miniutesAndSecondsOptions } from '../../lib/utis'; 

import { Instance, InstanceTest } from '../../generated/graphql';

const TestItem = ({
  test,
  instanceId,
}: {
  test: InstanceTest | null;
  instanceId: string;
}) => {
  if (!test) {
    return <CorruptedTest />;
  }

  return <Test instanceId={instanceId} test={test} />;
};

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
      <div className={css`
        {
          margin: 12px 0;
        }
      `}>
        <DataTable
          rows={tests}
          loading={false}
          columns={[
            {
              name: 'status',
              header: 'Status',
              sortable: false,
              render: test => <TestState state={test.state} />,
            },
            {
              name: 'durration',
              header: 'Durration',
              sortable: false,
              render: test => {
                if (test?.wallClockDuration) {
                  return (
                    <Tooltip text={`Started at ${test.wallClockStartedAt}`}>
                      <Text>{shortEnglishHumanizerWithMsIfNeeded(test.wallClockDuration, miniutesAndSecondsOptions)}</Text>
                    </Tooltip>
                  )
                } else {
                  return '';
                }
              },
            },
            {
              name: 'link',
              header: '',
              sortable: false,
              render: test => (
                <Link href={generatePath(`/instance/${instance?.instanceId}/test/${test.testId}`)}>
                  {test.title.join(' > ')}
                </Link>
              ),
            }
          ]}
        />
      </div>
    </div>
  );
};
